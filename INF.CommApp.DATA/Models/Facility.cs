namespace INF.CommApp.DATA.Models
{
    public class Facility
    {
        public int Id { get; set; }
        public Guid ExternalId { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public ICollection<Resident> Residents { get; set; }
    }
}
