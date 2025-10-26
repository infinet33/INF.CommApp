namespace INF.CommApp.DATA.Models
{
    /// <summary>
    /// Junction table for many-to-many relationship between Users and Facilities (multi-tenancy)
    /// Allows users to belong to multiple facilities and facilities to have multiple users
    /// </summary>
    public class UserFacility
    {
        /// <summary>User ID (Foreign Key)</summary>
        public int UserId { get; set; }

        /// <summary>Facility ID (Foreign Key)</summary>
        public int FacilityId { get; set; }

        /// <summary>When this user was assigned to this facility</summary>
        public DateTime AssignedOnUtc { get; set; } = DateTime.UtcNow;

        /// <summary>User's role/position at this specific facility</summary>
        public string? RoleAtFacility { get; set; }

        /// <summary>Whether this user is active at this facility</summary>
        public bool IsActive { get; set; } = true;

        /// <summary>When this assignment ends (null for indefinite)</summary>
        public DateTime? EndDateUtc { get; set; }

        // Navigation properties
        /// <summary>Navigation property to User</summary>
        public User User { get; set; } = null!;

        /// <summary>Navigation property to Facility</summary>
        public Facility Facility { get; set; } = null!;
    }
}