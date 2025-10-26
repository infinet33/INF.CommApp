namespace INF.CommApp.DATA.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public Guid ExternalId { get; set; } = Guid.NewGuid();
        public string Message { get; set; }
        public NotificationPriority Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public int FacilityId { get; set; }
        public Facility Facility { get; set; }
        public ICollection<NotificationSubscription> NotificationSubscriptions { get; set; }
    }

    public enum NotificationPriority
    {
        General,
        Incident,
        High,
        Medium,
        Low
    }
}
