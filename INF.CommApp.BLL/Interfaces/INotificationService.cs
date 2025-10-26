using INF.CommApp.BLL.Models;
using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Interfaces
{
    /// <summary>
    /// Interface for notification delivery providers (SMS, Push, IVR, etc.)
    /// </summary>
    public interface INotificationProvider
    {
        public NotificationChannel SupportedChannel { get; }
        public Task<NotificationResult> SendAsync(NotificationRequest request);
        public Task<NotificationBatchResult> SendBatchAsync(List<NotificationRequest> requests);
        public bool IsConfigured { get; }
    }

    /// <summary>
    /// Main notification service interface
    /// </summary>
    public interface INotificationService
    {
        /// <summary>
        /// Send notification through specified channels
        /// </summary>
        public Task<NotificationBatchResult> SendNotificationAsync(NotificationRequest request);

        /// <summary>
        /// Send notifications to multiple recipients
        /// </summary>
        public Task<NotificationBatchResult> SendBatchNotificationsAsync(List<NotificationRequest> requests);

        /// <summary>
        /// Send notification ABOUT a resident TO their care team members
        /// The notification will be tracked in the resident's chart/history
        /// </summary>
        public Task<NotificationBatchResult> SendAboutResidentToCareTeamAsync(Guid residentExternalId, string message, NotificationPriority priority, NotificationChannel channels = NotificationChannel.All);

        /// <summary>
        /// Send facility-wide notification to all staff members
        /// </summary>
        public Task<NotificationBatchResult> SendFacilityNotificationAsync(Guid facilityExternalId, string message, NotificationPriority priority, NotificationChannel channels = NotificationChannel.All);

        /// <summary>
        /// Create a notification record for a resident by a user
        /// </summary>
        public Task<Notification> CreateNotificationForResidentAsync(Guid userExternalId, Guid residentExternalId, string message, NotificationPriority priority);

        /// <summary>
        /// Register a new notification provider
        /// </summary>
        public void RegisterProvider(INotificationProvider provider);

        /// <summary>
        /// Get available notification channels
        /// </summary>
        public List<NotificationChannel> GetAvailableChannels();
    }
}