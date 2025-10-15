namespace INF.CommApp.DATA.Models
{
    public class UserResident
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int ResidentId { get; set; }
        public Resident Resident { get; set; }
    }
}
