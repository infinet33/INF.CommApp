namespace INF.CommApp.DATA.Models
{
    /// <summary>
    /// Represents a role in the healthcare communication system
    /// </summary>
    public class Role
    {
        public int Id { get; set; }
        public Guid ExternalId { get; set; } = Guid.NewGuid();

        /// <summary>Role name (e.g., "Administrator", "Nurse", "Doctor", "Caregiver")</summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>Normalized role name for lookups</summary>
        public string NormalizedName { get; set; } = string.Empty;

        /// <summary>Optional description of the role</summary>
        public string? Description { get; set; }

        /// <summary>Concurrency stamp for optimistic concurrency</summary>
        public string? ConcurrencyStamp { get; set; } = Guid.NewGuid().ToString();

        /// <summary>When this role was created</summary>
        public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; } = [];
    }
}