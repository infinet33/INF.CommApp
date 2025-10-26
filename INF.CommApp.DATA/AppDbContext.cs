using INF.CommApp.DATA.Models;
using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.DATA
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Facility> Facilities { get; set; }
        public DbSet<Resident> Residents { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Agency> Agencies { get; set; }
        public DbSet<UserResident> UserResidents { get; set; }
        public DbSet<UserFacility> UserFacilities { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationSubscription> NotificationSubscriptions { get; set; }
        public DbSet<UserNotificationPreference> UserNotificationPreferences { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserResident>()
                .HasKey(ur => new { ur.UserId, ur.ResidentId });

            // Configure ExternalId indexes for secure GUID-based lookups
            modelBuilder.Entity<User>()
                .HasIndex(u => u.ExternalId)
                .IsUnique()
                .HasDatabaseName("IX_Users_ExternalId");

            modelBuilder.Entity<Facility>()
                .HasIndex(f => f.ExternalId)
                .IsUnique()
                .HasDatabaseName("IX_Facilities_ExternalId");

            modelBuilder.Entity<Resident>()
                .HasIndex(r => r.ExternalId)
                .IsUnique()
                .HasDatabaseName("IX_Residents_ExternalId");

            modelBuilder.Entity<Agency>()
                .HasIndex(a => a.ExternalId)
                .IsUnique()
                .HasDatabaseName("IX_Agencies_ExternalId");

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.ExternalId)
                .IsUnique()
                .HasDatabaseName("IX_Notifications_ExternalId");

            modelBuilder.Entity<UserNotificationPreference>()
                .HasIndex(unp => unp.ExternalId)
                .IsUnique()
                .HasDatabaseName("IX_UserNotificationPreferences_ExternalId");

            // Configure unique constraint on UserId + NotificationType
            modelBuilder.Entity<UserNotificationPreference>()
                .HasIndex(unp => new { unp.UserId, unp.NotificationType })
                .IsUnique()
                .HasDatabaseName("IX_UserNotificationPreferences_UserId_NotificationType");

            // Configure User -> UserNotificationPreference relationship
            modelBuilder.Entity<UserNotificationPreference>()
                .HasOne(unp => unp.User)
                .WithMany(u => u.NotificationPreferences)
                .HasForeignKey(unp => unp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure UserRole junction table (many-to-many User <-> Role)
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure UserFacility junction table (many-to-many User <-> Facility)
            modelBuilder.Entity<UserFacility>()
                .HasKey(uf => new { uf.UserId, uf.FacilityId });

            modelBuilder.Entity<UserFacility>()
                .HasOne(uf => uf.User)
                .WithMany(u => u.UserFacilities)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserFacility>()
                .HasOne(uf => uf.Facility)
                .WithMany(f => f.UserFacilities)
                .HasForeignKey(uf => uf.FacilityId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Role indexes
            modelBuilder.Entity<Role>()
                .HasIndex(r => r.ExternalId)
                .IsUnique()
                .HasDatabaseName("IX_Roles_ExternalId");

            modelBuilder.Entity<Role>()
                .HasIndex(r => r.NormalizedName)
                .IsUnique()
                .HasDatabaseName("IX_Roles_NormalizedName");

            // Configure User authentication indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.EmailAddress)
                .IsUnique()
                .HasDatabaseName("IX_Users_EmailAddress");

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .HasDatabaseName("IX_Users_UserName");

            // Add other relationships as needed
        }
    }
}