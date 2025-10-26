using INF.CommApp.BLL.Models;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace INF.CommApp.BLL.Services
{
    public interface IUserNotificationPreferencesService
    {
        public Task<UserNotificationPreferences> GetUserPreferencesAsync(int userId);
        public Task<UserNotificationPreferences> UpdateUserPreferencesAsync(int userId, UserNotificationPreferences preferences);
        public Task<Dictionary<int, UserNotificationPreferences>> GetBatchUserPreferencesAsync(List<int> userIds);
    }

    public class UserNotificationPreferencesService : IUserNotificationPreferencesService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserNotificationPreferencesService> _logger;
        private readonly Dictionary<int, UserNotificationPreferences> _cache;

        public UserNotificationPreferencesService(AppDbContext context, ILogger<UserNotificationPreferencesService> logger)
        {
            _context = context;
            _logger = logger;
            _cache = [];
        }

        public async Task<UserNotificationPreferences> GetUserPreferencesAsync(int userId)
        {
            // Check cache first
            if (_cache.TryGetValue(userId, out UserNotificationPreferences? cachedPreferences))
            {
                return cachedPreferences;
            }

            // TODO: Once you add a UserNotificationPreferences table to your database,
            // retrieve from there. For now, return default preferences.

            UserNotificationPreferences preferences = await GetDefaultPreferencesForUserAsync(userId);
            _cache[userId] = preferences;
            
            return preferences;
        }

        public async Task<UserNotificationPreferences> UpdateUserPreferencesAsync(int userId, UserNotificationPreferences preferences)
        {
            // TODO: Save to database once UserNotificationPreferences table is created
            
            // For now, update cache
            _cache[userId] = preferences;
            
            _logger.LogInformation($"Updated notification preferences for user {userId}");
            
            return preferences;
        }

        public async Task<Dictionary<int, UserNotificationPreferences>> GetBatchUserPreferencesAsync(List<int> userIds)
        {
            Dictionary<int, UserNotificationPreferences> preferences = [];
            
            foreach (int userId in userIds)
            {
                preferences[userId] = await GetUserPreferencesAsync(userId);
            }
            
            return preferences;
        }

        /// <summary>
        /// Get default preferences based on user type
        /// </summary>
        private async Task<UserNotificationPreferences> GetDefaultPreferencesForUserAsync(int userId)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            
            if (user == null)
            {
                return new UserNotificationPreferences { UserId = userId };
            }

            // Set different defaults based on user type
            UserNotificationPreferences preferences = new UserNotificationPreferences
            {
                UserId = userId,
                SmsEnabled = true,
                PushEnabled = true,
                EmailEnabled = true,
                IvrEnabled = false // Default to false for IVR
            };

            // Customize based on user role
            switch (user.Type?.ToLower())
            {
                case "nurse":
                case "doctor":
                    preferences.MinimumUrgentPriority = NotificationPriority.Medium;
                    preferences.IvrEnabled = true; // Enable IVR for critical staff
                    break;
                    
                case "caregiver":
                    preferences.MinimumUrgentPriority = NotificationPriority.High;
                    break;
                    
                case "administrator":
                case "manager":
                    preferences.MinimumUrgentPriority = NotificationPriority.Low;
                    preferences.QuietHoursStart = new TimeSpan(18, 0, 0); // 6 PM
                    preferences.QuietHoursEnd = new TimeSpan(8, 0, 0);   // 8 AM
                    break;
            }

            return preferences;
        }
    }
}