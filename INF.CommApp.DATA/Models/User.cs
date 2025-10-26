namespace INF.CommApp.DATA.Models
{
    public class User
    {
        public int Id { get; set; }
        public Guid ExternalId { get; set; } = Guid.NewGuid();

        // Required user information
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string? MobileNumber { get; set; }
        public string PasswordHash { get; set; } = string.Empty;

        // Authentication & Security
        public string? SecurityStamp { get; set; } = Guid.NewGuid().ToString();
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public int AccessFailedCount { get; set; }
        public DateTime? LockoutEndUtc { get; set; }
        public bool LockoutEnabled { get; set; } = true;

        // Activity tracking
        public DateTime? LastLoginTimeUtc { get; set; }
        public DateTime CreatedOnUtc { get; set; } = DateTime.UtcNow;

        // Legacy/additional fields
        public string UserName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // nurse, caregiver, doctor, etc.
        public int? AgencyId { get; set; }

        // Navigation properties
        public Agency? Agency { get; set; }
        public ICollection<UserResident> UserResidents { get; set; } = [];
        public ICollection<UserFacility> UserFacilities { get; set; } = [];
        public ICollection<NotificationSubscription> NotificationSubscriptions { get; set; } = [];
        public ICollection<UserNotificationPreference> NotificationPreferences { get; set; } = [];
        public ICollection<UserRole> UserRoles { get; set; } = [];
    }
}
