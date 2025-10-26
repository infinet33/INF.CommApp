using INF.CommApp.BLL.Interfaces;
using INF.CommApp.BLL.Models;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace INF.CommApp.BLL.Services
{
    /// <summary>
    /// Main notification service that orchestrates multiple notification providers
    /// </summary>
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationService> _logger;
        private readonly Dictionary<NotificationChannel, INotificationProvider> _providers;
        private readonly IUserNotificationPreferencesService? _preferencesService;

        public NotificationService(
            AppDbContext context,
            ILogger<NotificationService> logger,
            IUserNotificationPreferencesService? preferencesService = null)
        {
            _context = context;
            _logger = logger;
            _providers = [];
            _preferencesService = preferencesService;
        }

        public void RegisterProvider(INotificationProvider provider)
        {
            if (provider.IsConfigured)
            {
                _providers[provider.SupportedChannel] = provider;
                _logger.LogInformation($"Registered notification provider for {provider.SupportedChannel}");
            }
            else
            {
                _logger.LogWarning($"Provider for {provider.SupportedChannel} not configured, skipping registration");
            }
        }

        public List<NotificationChannel> GetAvailableChannels()
        {
            return _providers.Keys.ToList();
        }

        public async Task<NotificationBatchResult> SendNotificationAsync(NotificationRequest request)
        {
            NotificationBatchResult batchResult = new NotificationBatchResult();

            // Get the individual channels from the flags enum
            List<NotificationChannel> requestedChannels = GetIndividualChannels(request.Channels);

            foreach (NotificationChannel channel in requestedChannels)
            {
                if (_providers.TryGetValue(channel, out INotificationProvider? provider))
                {
                    try
                    {
                        NotificationResult result = await provider.SendAsync(request);
                        batchResult.Results.Add(result);

                        _logger.LogInformation($"Notification sent via {channel}: {result.Message}");
                    }
                    catch (Exception ex)
                    {
                        NotificationResult errorResult = new NotificationResult
                        {
                            IsSuccess = false,
                            Channel = channel,
                            Message = $"Provider error: {ex.Message}",
                            ErrorCode = ex.GetType().Name,
                            SentAt = DateTime.UtcNow
                        };
                        batchResult.Results.Add(errorResult);

                        _logger.LogError(ex, $"Error sending notification via {channel}");
                    }
                }
                else
                {
                    NotificationResult notAvailableResult = new NotificationResult
                    {
                        IsSuccess = false,
                        Channel = channel,
                        Message = $"Provider for {channel} not available",
                        ErrorCode = "PROVIDER_NOT_AVAILABLE",
                        SentAt = DateTime.UtcNow
                    };
                    batchResult.Results.Add(notAvailableResult);

                    _logger.LogWarning($"No provider available for channel {channel}");
                }
            }

            // Log notification attempt to database
            await LogNotificationAttempt(request, batchResult);

            return batchResult;
        }

        public async Task<NotificationBatchResult> SendBatchNotificationsAsync(List<NotificationRequest> requests)
        {
            NotificationBatchResult overallResult = new NotificationBatchResult();

            foreach (NotificationRequest request in requests)
            {
                NotificationBatchResult result = await SendNotificationAsync(request);
                overallResult.Results.AddRange(result.Results);
            }

            _logger.LogInformation($"Batch notification completed. Total sent: {overallResult.TotalSent}, Total failed: {overallResult.TotalFailed}");

            return overallResult;
        }

        public async Task<NotificationBatchResult> SendAboutResidentToCareTeamAsync(Guid residentExternalId, string message, NotificationPriority priority, NotificationChannel channels = NotificationChannel.All)
        {
            try
            {
                // First get the resident by external ID
                Resident? resident = await _context.Residents
                    .Include(r => r.Facility)
                    .FirstOrDefaultAsync(r => r.ExternalId == residentExternalId);

                if (resident == null)
                {
                    _logger.LogWarning($"No resident found with external ID {residentExternalId}");
                    return new NotificationBatchResult();
                }

                // Get all users assigned to this resident
                List<User> careTeam = await _context.UserResidents
                    .Where(ur => ur.ResidentId == resident.Id)
                    .Include(ur => ur.User)
                    .Select(ur => ur.User)
                    .ToListAsync();

                if (!careTeam.Any())
                {
                    _logger.LogWarning($"No care team found for resident {residentExternalId}");
                    return new NotificationBatchResult();
                }

                string contextualMessage = resident != null
                    ? $"[{resident.Facility.Name}] {resident.FirstName} {resident.LastName}: {message}"
                    : message;

                // Get user preferences for filtering
                List<int> userIds = careTeam.Select(u => u.Id).ToList();
                Dictionary<int, UserNotificationPreferences> userPreferences = await GetUserPreferencesAsync(userIds);

                // Create notification requests for each care team member with their preferences
                List<NotificationRequest> requests = [];
                foreach (User? user in careTeam)
                {
                    UserNotificationPreferences preferences = userPreferences.GetValueOrDefault(user.Id, new UserNotificationPreferences { UserId = user.Id });

                    // Check if user should receive notification at this time
                    if (!preferences.ShouldSendNow(priority))
                    {
                        _logger.LogInformation($"Skipping notification for user {user.Id} due to quiet hours (priority: {priority})");
                        continue;
                    }

                    // Apply user's channel preferences to requested channels
                    NotificationChannel userEnabledChannels = preferences.GetEnabledChannels();
                    NotificationChannel finalChannels = channels & userEnabledChannels; // Intersection of requested and enabled channels

                    if (finalChannels == NotificationChannel.None)
                    {
                        _logger.LogInformation($"No enabled channels for user {user.Id}, skipping notification");
                        continue;
                    }

                    NotificationRequest request = new NotificationRequest
                    {
                        Message = contextualMessage,
                        Priority = priority,
                        Channels = finalChannels, // Use filtered channels based on user preferences
                        Recipients = GetUserContactInfo(user),
                        AboutResidentId = resident.Id, // Track which resident this notification is about
                        FacilityId = resident?.FacilityId,
                        Metadata = new Dictionary<string, object>
                        {
                            ["AboutResidentId"] = resident.Id, // The resident this notification concerns
                            ["RecipientUserId"] = user.Id,    // The care team member receiving the notification
                            ["RecipientUserType"] = user.Type,
                            ["RequestedChannels"] = channels.ToString(),
                            ["UserEnabledChannels"] = userEnabledChannels.ToString(),
                            ["FinalChannels"] = finalChannels.ToString(),
                            ["NotificationType"] = "ResidentCare"
                        }
                    };
                    requests.Add(request);
                }

                if (!requests.Any())
                {
                    _logger.LogWarning($"No eligible users found for notification after applying preferences (residentExternalId: {residentExternalId})");
                    return new NotificationBatchResult();
                }

                return await SendBatchNotificationsAsync(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending notification to care team for resident {residentExternalId}");
                return new NotificationBatchResult();
            }
        }

        public async Task<NotificationBatchResult> SendFacilityNotificationAsync(Guid facilityExternalId, string message, NotificationPriority priority, NotificationChannel channels = NotificationChannel.All)
        {
            try
            {
                // First get the facility by external ID
                Facility? facility = await _context.Facilities.FirstOrDefaultAsync(f => f.ExternalId == facilityExternalId);

                if (facility == null)
                {
                    _logger.LogWarning($"No facility found with external ID {facilityExternalId}");
                    return new NotificationBatchResult();
                }

                // Get all users who work at this facility (through residents they care for)
                List<User> facilityStaff = await _context.UserResidents
                    .Where(ur => ur.Resident.FacilityId == facility.Id)
                    .Include(ur => ur.User)
                    .Select(ur => ur.User)
                    .Distinct()
                    .ToListAsync();

                if (!facilityStaff.Any())
                {
                    _logger.LogWarning($"No staff found for facility {facilityExternalId}");
                    return new NotificationBatchResult();
                }
                string contextualMessage = facility != null
                    ? $"[{facility.Name}] FACILITY ALERT: {message}"
                    : message;

                // Create notification requests for each staff member
                List<NotificationRequest> requests = [];
                foreach (User? user in facilityStaff)
                {
                    NotificationRequest request = new NotificationRequest
                    {
                        Message = contextualMessage,
                        Priority = priority,
                        Channels = channels,
                        Recipients = GetUserContactInfo(user),
                        Metadata = new Dictionary<string, object>
                        {
                            ["FacilityId"] = facility.Id,
                            ["UserId"] = user.Id,
                            ["UserType"] = user.Type
                        }
                    };
                    requests.Add(request);
                }

                return await SendBatchNotificationsAsync(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending facility notification for facility {facilityExternalId}");
                return new NotificationBatchResult();
            }
        }

        /// <summary>
        /// Extract individual channels from flags enum
        /// </summary>
        private List<NotificationChannel> GetIndividualChannels(NotificationChannel channels)
        {
            List<NotificationChannel> individualChannels = [];

            foreach (NotificationChannel channel in Enum.GetValues<NotificationChannel>())
            {
                if (channel != NotificationChannel.None &&
                    channel != NotificationChannel.All &&
                    channels.HasFlag(channel))
                {
                    individualChannels.Add(channel);
                }
            }

            return individualChannels;
        }

        /// <summary>
        /// Get user contact information for notifications
        /// TODO: Implement based on how you store phone numbers, device tokens, etc.
        /// </summary>
        private List<string> GetUserContactInfo(User user)
        {
            List<string> contactInfo =
            [
                // TODO: You'll need to add fields to the User model or create a separate UserContact table
                // For now, returning placeholder data

                // Example: if you add PhoneNumber field to User model
                // if (!string.IsNullOrEmpty(user.PhoneNumber))
                //     contactInfo.Add(user.PhoneNumber);

                // For demonstration purposes, using username as placeholder
                $"+1234567890" // Replace with actual phone number field
            ];

            return contactInfo;
        }

        /// <summary>
        /// Log notification attempts to database for audit trail and resident chart history
        /// This creates a record that can be linked to the resident's care history
        /// </summary>
        private async Task LogNotificationAttempt(NotificationRequest request, NotificationBatchResult result)
        {
            try
            {
                Notification notification = new Notification
                {
                    Message = request.Message,
                    Priority = request.Priority,
                    CreatedAt = DateTime.UtcNow,
                    FacilityId = request.FacilityId ?? GetFacilityIdFromMetadata(request) ?? 1
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                // Log which resident this notification was about (for chart tracking)
                if (request.AboutResidentId.HasValue)
                {
                    _logger.LogInformation($"Logged notification about resident {request.AboutResidentId} with ID {notification.Id}. " +
                                         $"Sent to {result.TotalSent} care team members, {result.TotalFailed} failed.");
                }
                else
                {
                    _logger.LogInformation($"Logged facility notification with ID {notification.Id}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log notification attempt to database");
            }
        }

        private int? GetFacilityIdFromMetadata(NotificationRequest request)
        {
            if (request.Metadata.TryGetValue("FacilityId", out object? facilityId))
            {
                return facilityId as int?;
            }
            return null;
        }

        /// <summary>
        /// Get user notification preferences for batch of users
        /// </summary>
        private async Task<Dictionary<int, UserNotificationPreferences>> GetUserPreferencesAsync(List<int> userIds)
        {
            if (_preferencesService != null)
            {
                return await _preferencesService.GetBatchUserPreferencesAsync(userIds);
            }

            // Fallback: return default preferences for all users
            Dictionary<int, UserNotificationPreferences> defaultPreferences = [];
            foreach (int userId in userIds)
            {
                defaultPreferences[userId] = new UserNotificationPreferences { UserId = userId };
            }
            return defaultPreferences;
        }

        /// <summary>
        /// Create a notification record for a resident by a user
        /// </summary>
        public async Task<Notification> CreateNotificationForResidentAsync(Guid userExternalId, Guid residentExternalId, string message, NotificationPriority priority)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.ExternalId == userExternalId);
            if (user == null)
            {
                throw new ArgumentException($"User with external ID {userExternalId} not found");
            }

            Resident? resident = await _context.Residents.FirstOrDefaultAsync(x => x.ExternalId == residentExternalId);
            if (resident == null)
            {
                throw new ArgumentException($"Resident with external ID {residentExternalId} not found");
            }

            Notification notification = new Notification
            {
                Message = message,
                Priority = priority,
                CreatedAt = DateTime.UtcNow,
                FacilityId = resident.FacilityId
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Subscribe the user to the notification they created
            NotificationSubscription notificationSubscription = new NotificationSubscription
            {
                NotificationId = notification.Id,
                UserId = user.Id
            };

            _context.NotificationSubscriptions.Add(notificationSubscription);
            await _context.SaveChangesAsync();

            return notification;
        }
    }
}