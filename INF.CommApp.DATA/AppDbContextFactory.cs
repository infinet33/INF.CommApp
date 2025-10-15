using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace INF.CommApp.DATA
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            // Use your actual connection string here
            optionsBuilder.UseSqlServer("Server=tcp:inf-sql-server-poc.database.windows.net,1433;Initial Catalog=CommAppPoC;Persist Security Info=False;User ID=admin@infinetsolutions.net;Password=Teamlosi33!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Authentication=\"Active Directory Password\";");
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}