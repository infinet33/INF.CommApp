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
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationSubscription> NotificationSubscriptions { get; set; }

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

            // Add other relationships as needed
        }
    }
}