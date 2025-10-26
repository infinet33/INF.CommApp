using FluentAssertions;
using INF.CommApp.API.Models;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace INF.CommApp.Tests.Integration.Controllers;

/// <summary>
/// Integration tests for AuthController that verify actual database storage and retrieval
/// </summary>
public class AuthControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AuthControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Use a dedicated test database with SQL Server
                var testConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=INF.CommApp.IntegrationTests;Trusted_Connection=true;TrustServerCertificate=true";

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseSqlServer(testConnectionString);
                    options.EnableSensitiveDataLogging();
                });

                // Ensure database is created and seeded
                var serviceProvider = services.BuildServiceProvider();
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

                // Clean and recreate database for each test run
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();
                SeedRolesAsync(roleManager).GetAwaiter().GetResult();
            });

            // Reduce logging noise for integration tests
            builder.ConfigureLogging(logging =>
            {
                logging.ClearProviders();
                logging.AddConsole();
                logging.SetMinimumLevel(LogLevel.Warning);
            });
        });

        _client = _factory.CreateClient();
    }

    private static async Task SeedRolesAsync(RoleManager<Role> roleManager)
    {
        var roles = new[]
        {
            SystemRoles.Administrator,
            SystemRoles.FacilityAdmin,
            SystemRoles.FacilityManager,
            SystemRoles.BillingAdmin,
            SystemRoles.Doctor,
            SystemRoles.Nurse,
            SystemRoles.LPN,
            SystemRoles.CNA,
            SystemRoles.Pharmacist,
            SystemRoles.Caregiver,
            SystemRoles.Resident,
            SystemRoles.FamilyMember,
            SystemRoles.ReadOnly
        };

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new Role
                {
                    Name = roleName,
                    NormalizedName = roleName.ToUpperInvariant()
                });
            }
        }
    }

    #region Database Integration Tests

    [Fact]
    public async Task Register_ValidUser_StoresUserInDatabase()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "Integration",
            LastName = "TestUser",
            Email = "integration.test@healthcare.com",
            Password = "SecurePass123!",
            PhoneNumber = "555-9999",
            UserType = "nurse"
        };

        // BREAKPOINT 1: Set breakpoint here to examine request before sending
        _ = "BREAKPOINT: About to send registration request";

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // BREAKPOINT 2: Set breakpoint here to examine response
        _ = "BREAKPOINT: Registration response received";

        // Assert HTTP response
        response.Should().BeSuccessful();
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        // Verify user was actually stored in database
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        // BREAKPOINT 3: Set breakpoint here to examine database state
        _ = "BREAKPOINT: About to query database for stored user";

        var storedUser = await context.Users
            .FirstOrDefaultAsync(u => u.EmailAddress == registerRequest.Email);

        // Verify user exists in database
        storedUser.Should().NotBeNull();
        storedUser!.FirstName.Should().Be("Integration");
        storedUser.LastName.Should().Be("TestUser");
        storedUser.EmailAddress.Should().Be("integration.test@healthcare.com");
        storedUser.UserName.Should().Be("integration.test@healthcare.com");
        storedUser.MobileNumber.Should().Be("555-9999");
        storedUser.Type.Should().Be("nurse");
        storedUser.EmailConfirmed.Should().BeFalse();
        storedUser.ExternalId.Should().NotBeEmpty();

        // Verify user has correct role assigned
        var userRoles = await userManager.GetRolesAsync(storedUser);
        userRoles.Should().Contain(SystemRoles.Nurse);

        // BREAKPOINT 4: Set breakpoint here to examine final verification results
        _ = "BREAKPOINT: Database verification complete";
    }

    [Fact]
    public async Task Register_DuplicateEmail_DoesNotCreateDuplicateInDatabase()
    {
        // Arrange - First registration
        var firstUser = new RegisterRequest
        {
            FirstName = "First",
            LastName = "User",
            Email = "duplicate@healthcare.com",
            Password = "SecurePass123!",
            UserType = "doctor"
        };

        // Act - Register first user
        var firstResponse = await _client.PostAsJsonAsync("/api/auth/register", firstUser);
        firstResponse.Should().BeSuccessful();

        // Arrange - Second registration with same email
        var duplicateUser = new RegisterRequest
        {
            FirstName = "Second",
            LastName = "User",
            Email = "duplicate@healthcare.com", // Same email
            Password = "DifferentPass123!",
            UserType = "nurse"
        };

        // Act - Try to register duplicate
        var duplicateResponse = await _client.PostAsJsonAsync("/api/auth/register", duplicateUser);

        // Assert - Should fail
        duplicateResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);

        // Verify only one user exists in database
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var usersWithEmail = await context.Users
            .Where(u => u.EmailAddress == "duplicate@healthcare.com")
            .ToListAsync();

        usersWithEmail.Should().HaveCount(1);
        usersWithEmail[0].FirstName.Should().Be("First"); // Original user preserved
    }

    [Fact]
    public async Task Login_ValidUser_UpdatesLastLoginTimeInDatabase()
    {
        // Arrange - First register a user
        var registerRequest = new RegisterRequest
        {
            FirstName = "Login",
            LastName = "TestUser",
            Email = "login.test@healthcare.com",
            Password = "SecurePass123!",
            UserType = "doctor"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        registerResponse.Should().BeSuccessful();

        // Confirm the user's email (simulate email confirmation)
        using var scope = _factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(registerRequest.Email);
        user.Should().NotBeNull();

        var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user!);
        await userManager.ConfirmEmailAsync(user!, emailToken);

        // Get initial login time (should be null)
        var initialLoginTime = user!.LastLoginTimeUtc;

        // Arrange - Login request
        var loginRequest = new LoginRequest
        {
            Email = "login.test@healthcare.com",
            Password = "SecurePass123!"
        };

        // BREAKPOINT: Set breakpoint here to examine login attempt
        _ = "BREAKPOINT: About to attempt login";

        // Act - Login
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert - Login successful
        loginResponse.Should().BeSuccessful();
        loginResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        // Verify login response contains token
        var loginContent = await loginResponse.Content.ReadAsStringAsync();
        loginContent.Should().Contain("token");

        // Verify LastLoginTime was updated in database
        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<AppDbContext>();

        var updatedUser = await verifyContext.Users
            .FirstOrDefaultAsync(u => u.EmailAddress == loginRequest.Email);

        updatedUser.Should().NotBeNull();
        updatedUser!.LastLoginTimeUtc.Should().NotBeNull();
        updatedUser.LastLoginTimeUtc.Should().BeAfter(DateTime.UtcNow.AddMinutes(-1));

        // BREAKPOINT: Set breakpoint here to examine updated user data
        _ = "BREAKPOINT: Login time verification complete";
    }

    [Theory]
    [InlineData("doctor", SystemRoles.Doctor)]
    [InlineData("nurse", SystemRoles.Nurse)]
    [InlineData("lpn", SystemRoles.LPN)]
    [InlineData("cna", SystemRoles.CNA)]
    [InlineData("pharmacist", SystemRoles.Pharmacist)]
    [InlineData("caregiver", SystemRoles.Caregiver)]
    [InlineData("admin", SystemRoles.Administrator)]
    [InlineData("facilityadmin", SystemRoles.FacilityAdmin)]
    [InlineData("facilitymanager", SystemRoles.FacilityManager)]
    [InlineData("billingadmin", SystemRoles.BillingAdmin)]
    [InlineData("resident", SystemRoles.Resident)]
    [InlineData("familymember", SystemRoles.FamilyMember)]
    [InlineData("unknown", SystemRoles.ReadOnly)]
    public async Task Register_DifferentUserTypes_StoresCorrectRolesInDatabase(string userType, string expectedRole)
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "Role",
            LastName = "TestUser",
            Email = $"role.{userType}@healthcare.com",
            Password = "SecurePass123!",
            UserType = userType
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.Should().BeSuccessful();

        // Verify role in database
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var user = await context.Users
            .FirstOrDefaultAsync(u => u.EmailAddress == registerRequest.Email);

        user.Should().NotBeNull();

        var userRoles = await userManager.GetRolesAsync(user!);
        userRoles.Should().Contain(expectedRole);
    }

    [Fact]
    public async Task Register_And_Login_FullWorkflow_DatabasePersistence()
    {
        // This test verifies the complete workflow from registration to login
        // with full database persistence verification

        var testEmail = "fullworkflow@healthcare.com";

        // Step 1: Register
        var registerRequest = new RegisterRequest
        {
            FirstName = "Workflow",
            LastName = "TestUser",
            Email = testEmail,
            Password = "SecurePass123!",
            PhoneNumber = "555-WORKFLOW",
            UserType = "pharmacist"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        registerResponse.Should().BeSuccessful();

        // Step 2: Verify user in database after registration
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            var registeredUser = await context.Users
                .FirstOrDefaultAsync(u => u.EmailAddress == testEmail);

            registeredUser.Should().NotBeNull();
            registeredUser!.EmailConfirmed.Should().BeFalse();
            registeredUser.LastLoginTimeUtc.Should().BeNull();

            // Confirm email for login test
            var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(registeredUser);
            await userManager.ConfirmEmailAsync(registeredUser, emailToken);
        }

        // Step 3: Login
        var loginRequest = new LoginRequest
        {
            Email = testEmail,
            Password = "SecurePass123!"
        };

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        loginResponse.Should().BeSuccessful();

        // Step 4: Verify database state after login
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            var loggedInUser = await context.Users
                .FirstOrDefaultAsync(u => u.EmailAddress == testEmail);

            loggedInUser.Should().NotBeNull();
            loggedInUser!.EmailConfirmed.Should().BeTrue();
            loggedInUser.LastLoginTimeUtc.Should().NotBeNull();
            loggedInUser.LastLoginTimeUtc.Should().BeAfter(DateTime.UtcNow.AddMinutes(-1));

            var userRoles = await userManager.GetRolesAsync(loggedInUser);
            userRoles.Should().Contain(SystemRoles.Pharmacist);
        }

        // BREAKPOINT: Set breakpoint here to examine complete workflow results
        _ = "BREAKPOINT: Full workflow verification complete";
    }

    #endregion

    #region Database Query Tests

    [Fact]
    public async Task Database_CanQueryUsers_DirectDatabaseAccess()
    {
        // This test demonstrates direct database querying capabilities

        // First, create some test users
        var users = new[]
        {
            new RegisterRequest { FirstName = "Alice", LastName = "Doctor", Email = "alice@healthcare.com", Password = "SecurePass123!", UserType = "doctor" },
            new RegisterRequest { FirstName = "Bob", LastName = "Nurse", Email = "bob@healthcare.com", Password = "SecurePass123!", UserType = "nurse" },
            new RegisterRequest { FirstName = "Carol", LastName = "Pharmacist", Email = "carol@healthcare.com", Password = "SecurePass123!", UserType = "pharmacist" }
        };

        foreach (var user in users)
        {
            var response = await _client.PostAsJsonAsync("/api/auth/register", user);
            response.Should().BeSuccessful();
        }

        // Now query the database directly
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // BREAKPOINT: Set breakpoint here to examine database queries
        _ = "BREAKPOINT: About to perform database queries";

        // Query all users
        var allUsers = await context.Users.ToListAsync();
        allUsers.Should().HaveCountGreaterOrEqualTo(3);

        // Query users by type
        var doctors = await context.Users
            .Where(u => u.Type == "doctor")
            .ToListAsync();
        doctors.Should().HaveCountGreaterOrEqualTo(1);

        // Query with complex conditions
        var healthcareUsers = await context.Users
            .Where(u => u.EmailAddress!.Contains("@healthcare.com") &&
                       u.CreatedOnUtc > DateTime.UtcNow.AddHours(-1))
            .OrderBy(u => u.FirstName)
            .ToListAsync();

        healthcareUsers.Should().NotBeEmpty();
        healthcareUsers.First().FirstName.Should().Be("Alice");

        // BREAKPOINT: Set breakpoint here to examine query results
        _ = "BREAKPOINT: Database query verification complete";
    }

    #endregion
}