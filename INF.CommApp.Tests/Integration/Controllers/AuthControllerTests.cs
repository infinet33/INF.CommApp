using INF.CommApp.API.Models;
using INF.CommApp.DATA.Models;
using INF.CommApp.Tests.Fixtures;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace INF.CommApp.Tests.Integration.Controllers;

/// <summary>
/// Integration tests for AuthController - User Registration and Login functionality
/// </summary>
public class AuthControllerTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly ApiWebApplicationFactory _factory;

    public AuthControllerTests(ApiWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    #region Registration Tests

    [Fact]
    public async Task Register_ValidNurseUser_ReturnsSuccess()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane.doe@healthcare.com",
            Password = "SecurePass123!",
            PhoneNumber = "555-0123",
            UserType = "nurse"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);

        jsonDoc.RootElement.GetProperty("message").GetString().Should().Be("User created successfully");
        jsonDoc.RootElement.TryGetProperty("externalId", out var externalIdElement).Should().BeTrue();
        jsonDoc.RootElement.GetProperty("note").GetString().Should().Contain("confirm your email");
    }

    [Fact]
    public async Task Register_DoctorUser_AssignsCorrectRole()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "Dr. John",
            LastName = "Smith",
            Email = "dr.smith@healthcare.com",
            Password = "SecurePass123!",
            PhoneNumber = "555-0124",
            UserType = "doctor"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        // Verify user was created with correct role
        using var scope = _factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var user = await userManager.FindByEmailAsync(registerRequest.Email);
        user.Should().NotBeNull();
        user!.Type.Should().Be("doctor");

        var roles = await userManager.GetRolesAsync(user);
        roles.Should().Contain(SystemRoles.Doctor);
    }

    [Theory]
    [InlineData("nurse", SystemRoles.Nurse)]
    [InlineData("lpn", SystemRoles.LPN)]
    [InlineData("cna", SystemRoles.CNA)]
    [InlineData("pharmacist", SystemRoles.Pharmacist)]
    [InlineData("caregiver", SystemRoles.Caregiver)]
    [InlineData("unknown", SystemRoles.ReadOnly)] // Unknown types get ReadOnly
    public async Task Register_DifferentUserTypes_AssignsCorrectRoles(string userType, string expectedRole)
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = $"test.{userType}@healthcare.com",
            Password = "SecurePass123!",
            UserType = userType
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        // Verify correct role assignment
        using var scope = _factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var user = await userManager.FindByEmailAsync(registerRequest.Email);
        user.Should().NotBeNull();

        var roles = await userManager.GetRolesAsync(user!);
        roles.Should().Contain(expectedRole);
    }

    [Fact]
    public async Task Register_DuplicateEmail_ReturnsBadRequest()
    {
        // Arrange - Register first user
        var firstUser = new RegisterRequest
        {
            FirstName = "First",
            LastName = "User",
            Email = "duplicate@healthcare.com",
            Password = "SecurePass123!",
            UserType = "nurse"
        };
        await _client.PostAsJsonAsync("/api/auth/register", firstUser);

        // Try to register second user with same email
        var duplicateUser = new RegisterRequest
        {
            FirstName = "Second",
            LastName = "User",
            Email = "duplicate@healthcare.com", // Same email
            Password = "DifferentPass123!",
            UserType = "doctor"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", duplicateUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        jsonDoc.RootElement.GetProperty("message").GetString().Should().Contain("already exists");
    }

    [Theory]
    [InlineData("", "LastName", "test@email.com", "Password123!", "nurse")] // Empty FirstName
    [InlineData("FirstName", "", "test@email.com", "Password123!", "nurse")] // Empty LastName  
    [InlineData("FirstName", "LastName", "", "Password123!", "nurse")] // Empty Email
    [InlineData("FirstName", "LastName", "test@email.com", "", "nurse")] // Empty Password
    [InlineData("FirstName", "LastName", "test@email.com", "Password123!", "")] // Empty UserType
    [InlineData("FirstName", "LastName", "invalid-email", "Password123!", "nurse")] // Invalid Email
    public async Task Register_InvalidData_ReturnsBadRequest(string firstName, string lastName, string email, string password, string userType)
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Password = password,
            UserType = userType
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region Login Tests

    [Fact]
    public async Task Login_ValidCredentials_ReturnsTokenAndUserInfo()
    {
        // Arrange - First register a user
        var registerRequest = new RegisterRequest
        {
            FirstName = "Login",
            LastName = "Test",
            Email = "login.test@healthcare.com",
            Password = "SecurePass123!",
            UserType = "nurse"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Confirm email manually for testing (in real app, this would be via email confirmation)
        using var scope = _factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(registerRequest.Email);
        user!.EmailConfirmed = true;
        await userManager.UpdateAsync(user);

        var loginRequest = new LoginRequest
        {
            Email = "login.test@healthcare.com",
            Password = "SecurePass123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);

        // Verify response structure
        jsonDoc.RootElement.TryGetProperty("token", out var tokenElement).Should().BeTrue();
        tokenElement.GetString().Should().NotBeNullOrEmpty();

        jsonDoc.RootElement.GetProperty("firstName").GetString().Should().Be("Login");
        jsonDoc.RootElement.GetProperty("lastName").GetString().Should().Be("Test");
        jsonDoc.RootElement.GetProperty("email").GetString().Should().Be("login.test@healthcare.com");

        // Verify roles array
        jsonDoc.RootElement.TryGetProperty("roles", out var rolesElement).Should().BeTrue();
        var roles = rolesElement.EnumerateArray().Select(e => e.GetString()).ToList();
        roles.Should().Contain(SystemRoles.Nurse);

        // Verify expiration time is in the future
        jsonDoc.RootElement.TryGetProperty("expiresAt", out var expiresElement).Should().BeTrue();
        var expiresAt = expiresElement.GetDateTime();
        expiresAt.Should().BeAfter(DateTime.UtcNow);
    }

    [Fact]
    public async Task Login_InvalidEmail_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "nonexistent@healthcare.com",
            Password = "AnyPassword123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        jsonDoc.RootElement.GetProperty("message").GetString().Should().Be("Invalid email or password");
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized()
    {
        // Arrange - Register a user first
        var registerRequest = new RegisterRequest
        {
            FirstName = "Bad",
            LastName = "Password",
            Email = "bad.password@healthcare.com",
            Password = "CorrectPass123!",
            UserType = "nurse"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = "bad.password@healthcare.com",
            Password = "WrongPassword123!" // Wrong password
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        jsonDoc.RootElement.GetProperty("message").GetString().Should().Be("Invalid email or password");
    }

    [Fact]
    public async Task Login_UnconfirmedEmail_ReturnsBadRequest()
    {
        // Arrange - Register user but don't confirm email
        var registerRequest = new RegisterRequest
        {
            FirstName = "Unconfirmed",
            LastName = "Email",
            Email = "unconfirmed@healthcare.com",
            Password = "SecurePass123!",
            UserType = "nurse"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = "unconfirmed@healthcare.com",
            Password = "SecurePass123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        jsonDoc.RootElement.GetProperty("message").GetString().Should().Contain("Email address is not confirmed");
    }

    [Fact]
    public async Task Login_UpdatesLastLoginTime()
    {
        // Arrange - Register and confirm user
        var registerRequest = new RegisterRequest
        {
            FirstName = "Last",
            LastName = "Login",
            Email = "last.login@healthcare.com",
            Password = "SecurePass123!",
            UserType = "nurse"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        using var scope = _factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(registerRequest.Email);
        user!.EmailConfirmed = true;
        var originalLoginTime = user.LastLoginTimeUtc;
        await userManager.UpdateAsync(user);

        var loginRequest = new LoginRequest
        {
            Email = "last.login@healthcare.com",
            Password = "SecurePass123!"
        };

        // Act
        await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert - Verify LastLoginTimeUtc was updated
        using var verifyScope = _factory.Services.CreateScope();
        var verifyUserManager = verifyScope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var updatedUser = await verifyUserManager.FindByEmailAsync(registerRequest.Email);

        updatedUser!.LastLoginTimeUtc.Should().NotBeNull();
        if (originalLoginTime.HasValue)
        {
            updatedUser.LastLoginTimeUtc.Should().BeAfter(originalLoginTime.Value);
        }
        updatedUser.LastLoginTimeUtc.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromMinutes(1));
    }

    [Theory]
    [InlineData("", "password123")] // Empty email
    [InlineData("email@test.com", "")] // Empty password
    [InlineData("", "")] // Both empty
    public async Task Login_EmptyCredentials_ReturnsBadRequest(string email, string password)
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = email,
            Password = password
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region Account Lockout Tests

    [Fact]
    public async Task Login_MultipleFailedAttempts_CausesAccountLockout()
    {
        // Arrange - Register and confirm user
        var registerRequest = new RegisterRequest
        {
            FirstName = "Lockout",
            LastName = "Test",
            Email = "lockout.test@healthcare.com",
            Password = "CorrectPass123!",
            UserType = "nurse"
        };
        await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        using var scope = _factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(registerRequest.Email);
        user!.EmailConfirmed = true;
        await userManager.UpdateAsync(user);

        var loginRequest = new LoginRequest
        {
            Email = "lockout.test@healthcare.com",
            Password = "WrongPassword123!"
        };

        // Act - Attempt multiple failed logins (should cause lockout after 5 attempts)
        for (int i = 0; i < 5; i++)
        {
            await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        }

        // Try one more time - should be locked out
        var finalResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert 
        finalResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var content = await finalResponse.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        jsonDoc.RootElement.GetProperty("message").GetString().Should().Contain("locked out");
    }

    #endregion

    #region Edge Cases and Security Tests

    [Fact]
    public async Task Login_SqlInjectionAttempt_HandledSecurely()
    {
        // Arrange - SQL injection attempt in email field
        var maliciousLoginRequest = new LoginRequest
        {
            Email = "'; DROP TABLE Users; --",
            Password = "password"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", maliciousLoginRequest);

        // Assert - Should handle gracefully without exposing system details
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        jsonDoc.RootElement.GetProperty("message").GetString().Should().Be("Invalid email or password");
    }

    [Fact]
    public async Task Register_WeakPassword_ReturnsBadRequest()
    {
        // Arrange - Password that doesn't meet complexity requirements
        var registerRequest = new RegisterRequest
        {
            FirstName = "Weak",
            LastName = "Password",
            Email = "weak.password@healthcare.com",
            Password = "123", // Too simple
            UserType = "nurse"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var content = await response.Content.ReadAsStringAsync();
        var jsonDoc = JsonDocument.Parse(content);
        jsonDoc.RootElement.GetProperty("message").GetString().Should().Be("Failed to create user");

        // Should contain password complexity errors
        jsonDoc.RootElement.TryGetProperty("errors", out var errorsElement).Should().BeTrue();
        var errors = errorsElement.EnumerateArray().Select(e => e.GetString()).ToList();
        errors.Should().NotBeEmpty();
        errors.Should().Contain(e => e!.Contains("password") || e.Contains("Password"));
    }

    #endregion
}