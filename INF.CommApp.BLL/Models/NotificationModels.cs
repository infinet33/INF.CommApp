using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Models
{
    /// <summary>
    /// Represents a notification request to be sent to care team members about a resident
    /// </summary>
    public class NotificationRequest
    {
        public int NotificationId { get; set; }
        public string Message { get; set; }
        public NotificationPriority Priority { get; set; }
        public List<string> Recipients { get; set; } = []; // Care team member contact info
        public NotificationChannel Channels { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = [];
        
        /// <summary>
        /// ID of the resident this notification is about (for chart/history tracking)
        /// </summary>
        public int? AboutResidentId { get; set; }
        
        /// <summary>
        /// ID of the facility where this notification originated
        /// </summary>
        public int? FacilityId { get; set; }
    }

    /// <summary>
    /// Notification delivery channels (supports multiple channels)
    /// </summary>
    [Flags]
    public enum NotificationChannel
    {
        None = 0,
        SMS = 1,
        Push = 2,
        IVR = 4,
        Email = 8,
        All = SMS | Push | IVR | Email
    }

    /// <summary>
    /// Result of notification delivery attempt
    /// </summary>
    public class NotificationResult
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public NotificationChannel Channel { get; set; }
        public string ExternalId { get; set; } // Twilio SID, Push notification ID, etc.
        public DateTime SentAt { get; set; }
        public string ErrorCode { get; set; }
    }

    /// <summary>
    /// Batch result for multiple notification deliveries
    /// </summary>
    public class NotificationBatchResult
    {
        public List<NotificationResult> Results { get; set; } = [];
        public int TotalSent => Results.Count(r => r.IsSuccess);
        public int TotalFailed => Results.Count(r => !r.IsSuccess);
        public bool AllSuccessful => Results.All(r => r.IsSuccess);
    }
}