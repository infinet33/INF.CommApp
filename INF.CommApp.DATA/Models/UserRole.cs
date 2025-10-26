namespace INF.CommApp.DATA.Models
{
    /// <summary>
    /// Junction table linking Users to Roles (many-to-many relationship)
    /// </summary>
    public class UserRole
    {
        /// <summary>Foreign key to User</summary>
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        /// <summary>Foreign key to Role</summary>
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        /// <summary>When this user was assigned to this role</summary>
        public DateTime AssignedOnUtc { get; set; } = DateTime.UtcNow;

        /// <summary>Who assigned this role (optional)</summary>
        public int? AssignedByUserId { get; set; }
    }
}