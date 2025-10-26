using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using INF.CommApp.DATA;

namespace INF.CommApp.Tests.Fixtures;

/// <summary>
/// Custom WebApplicationFactory for integration testing
/// </summary>
public class ApiWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove SQL Server related services more thoroughly
            var descriptorsToRemove = services
                .Where(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                           d.ServiceType == typeof(DbContextOptions) ||
                           (d.ImplementationType?.FullName?.Contains("SqlServer") == true))
                .ToList();

            foreach (var descriptor in descriptorsToRemove)
            {
                services.Remove(descriptor);
            }

            // Use SQL Server test database
            var testConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=INF.CommApp.IntegrationTests;Trusted_Connection=true;TrustServerCertificate=true";
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(testConnectionString);
                options.EnableSensitiveDataLogging();
            });
        });

        builder.UseEnvironment("Testing");
    }
}