using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.DATA
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Resident> Residents { get; set; }
        // Add other DbSet properties as needed
    }
}