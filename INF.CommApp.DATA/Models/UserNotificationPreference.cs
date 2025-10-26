namespace INF.CommApp.DATA.Models
{
    public class UserNotificationPreference
    {
        public int Id { get; set; }
        public Guid ExternalId { get; set; } = Guid.NewGuid();

        // Foreign key to User
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Notification type (email, sms, push, in-app, etc.)
        public string NotificationType { get; set; } = string.Empty;

        // Whether this notification type is enabled for the user
        public bool IsEnabled { get; set; } = true;

        // Optional JSON settings specific to this notification type
        // Example: {"frequency": "immediate", "quiet_hours": "22:00-06:00"}
        public string? Settings { get; set; }

        // When this preference was created/updated
        public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedOnUtc { get; set; } = DateTime.UtcNow;
    }
}