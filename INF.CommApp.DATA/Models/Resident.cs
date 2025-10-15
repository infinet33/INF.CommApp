namespace INF.CommApp.DATA.Models
{
    public class Resident
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int FacilityId { get; set; }
        public Facility Facility { get; set; }
        public ICollection<UserResident> UserResidents { get; set; }
    }
}
