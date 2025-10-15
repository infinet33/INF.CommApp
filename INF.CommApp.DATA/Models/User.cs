namespace INF.CommApp.DATA.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Type { get; set; } // nurse, caregiver, doctor, etc.
        public int? AgencyId { get; set; }
        public Agency Agency { get; set; }
        public ICollection<UserResident> UserResidents { get; set; }
        public ICollection<NotificationSubscription> NotificationSubscriptions { get; set; }
    }
}
