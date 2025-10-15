namespace INF.CommApp.DATA.Models
{
    public class NotificationSubscription
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int NotificationId { get; set; }
        public Notification Notification { get; set; }
    }
}
