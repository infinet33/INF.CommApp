using FluentAssertions;
using INF.CommApp.API.Controllers;
using INF.CommApp.API.Models;
using INF.CommApp.API.Services;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace INF.CommApp.Tests.Unit.Controllers;

/// <summary>
/// Unit tests for AuthController registration and login functionality using mocks
/// </summary>
public class AuthControllerUnitTests
{
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<SignInManager<User>> _mockSignInManager;
    private readonly Mock<IJwtService> _mockJwtService;
    private readonly Mock<ILogger<AuthController>> _mockLogger;
    private readonly AuthController _controller;

    public AuthControllerUnitTests()
    {
        // Setup UserManager mock (simplified approach)
        var userStore = new Mock<IUserStore<User>>();
        _mockUserManager = new Mock<UserManager<User>>(userStore.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        // Setup SignInManager mock (simplified approach)
        var contextAccessor = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var claimsFactory = new Mock<IUserClaimsPrincipalFactory<User>>();
        _mockSignInManager = new Mock<SignInManager<User>>(_mockUserManager.Object, contextAccessor.Object, claimsFactory.Object, null!, null!, null!, null!);

        // Setup other mocks
        _mockJwtService = new Mock<IJwtService>();
        _mockLogger = new Mock<ILogger<AuthController>>();

        // Create controller
        _controller = new AuthController(
            _mockUserManager.Object,
            _mockSignInManager.Object,
            _mockJwtService.Object,
            _mockLogger.Object);
    }

    #region Registration Tests

    [Fact]
    public async Task Register_ValidNurseUser_ReturnsOkResult()
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

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User?)null); // User doesn't exist

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), registerRequest.Password))
            .ReturnsAsync(IdentityResult.Success);

        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), SystemRoles.Nurse))
            .ReturnsAsync(IdentityResult.Success);

        // BREAKPOINT 1: Click in left margin here to set breakpoint and examine registerRequest
        _ = "Set breakpoint here - examine registerRequest";

        // Act - BREAKPOINT 2: Click in left margin here to step into Register method  
        var result = await _controller.Register(registerRequest);

        // BREAKPOINT 3: Click in left margin here to examine result
        _ = "Set breakpoint here - examine result";

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var assertResult = (OkObjectResult)result;
        assertResult.StatusCode.Should().Be(200);

        // Verify that the correct methods were called
        _mockUserManager.Verify(x => x.FindByEmailAsync(registerRequest.Email), Times.Once);
        _mockUserManager.Verify(x => x.CreateAsync(It.Is<User>(u =>
            u.FirstName == "Jane" &&
            u.LastName == "Doe" &&
            u.EmailAddress == "jane.doe@healthcare.com" &&
            u.Type == "nurse"), registerRequest.Password), Times.Once);
        _mockUserManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), SystemRoles.Nurse), Times.Once);
    }

    [Fact]
    public async Task Register_DuplicateEmail_ReturnsBadRequest()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "existing@healthcare.com",
            Password = "SecurePass123!",
            UserType = "nurse"
        };

        var existingUser = new User { EmailAddress = "existing@healthcare.com" };
        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _controller.Register(registerRequest);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = (BadRequestObjectResult)result;
        badRequestResult.StatusCode.Should().Be(400);

        // Verify that CreateAsync was never called
        _mockUserManager.Verify(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Never);
    }

    [Theory]
    [InlineData("doctor", SystemRoles.Doctor)]
    [InlineData("nurse", SystemRoles.Nurse)]
    [InlineData("lpn", SystemRoles.LPN)]
    [InlineData("cna", SystemRoles.CNA)]
    [InlineData("pharmacist", SystemRoles.Pharmacist)]
    [InlineData("caregiver", SystemRoles.Caregiver)]
    [InlineData("administrator", SystemRoles.Administrator)]
    [InlineData("facilityadmin", SystemRoles.FacilityAdmin)]
    [InlineData("facilitymanager", SystemRoles.FacilityManager)]
    [InlineData("billingadmin", SystemRoles.BillingAdmin)]
    [InlineData("resident", SystemRoles.Resident)]
    [InlineData("familymember", SystemRoles.FamilyMember)]
    [InlineData("unknown", SystemRoles.ReadOnly)]
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

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User?)null);

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), registerRequest.Password))
            .ReturnsAsync(IdentityResult.Success);

        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), expectedRole))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.Register(registerRequest);

        // Assert
        result.Should().BeOfType<OkObjectResult>();

        // Verify correct role assignment
        _mockUserManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), expectedRole), Times.Once);
    }

    [Fact]
    public async Task Register_IdentityFailure_ReturnsBadRequest()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "Test",
            LastName = "User",
            Email = "test@healthcare.com",
            Password = "weak", // This will cause Identity to fail
            UserType = "nurse"
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User?)null);

        var identityErrors = new List<IdentityError>
        {
            new() { Code = "PasswordTooShort", Description = "Password is too short" },
            new() { Code = "PasswordRequiresDigit", Description = "Password must contain a digit" }
        };

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), registerRequest.Password))
            .ReturnsAsync(IdentityResult.Failed(identityErrors.ToArray()));

        // Act
        var result = await _controller.Register(registerRequest);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = (BadRequestObjectResult)result;
        badRequestResult.StatusCode.Should().Be(400);

        // Verify that AddToRoleAsync was never called due to failure
        _mockUserManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Never);
    }

    #endregion

    #region Login Tests

    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithToken()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "test@healthcare.com",
            Password = "SecurePass123!"
        };

        var user = new User
        {
            FirstName = "Test",
            LastName = "User",
            EmailAddress = "test@healthcare.com",
            EmailConfirmed = true,
            ExternalId = Guid.NewGuid()
        };

        var expectedToken = "jwt-token-here";
        var userRoles = new List<string> { SystemRoles.Nurse };

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, loginRequest.Password, true))
            .ReturnsAsync(SignInResult.Success);

        _mockJwtService.Setup(x => x.GenerateTokenAsync(user))
            .ReturnsAsync(expectedToken);

        _mockUserManager.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(userRoles);

        _mockUserManager.Setup(x => x.UpdateAsync(user))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.Login(loginRequest);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var okResult = (OkObjectResult)result;
        okResult.StatusCode.Should().Be(200);

        // Verify the response contains expected data
        var response = okResult.Value;
        response.Should().NotBeNull();

        // Verify that UpdateAsync was called to update LastLoginTime
        _mockUserManager.Verify(x => x.UpdateAsync(It.Is<User>(u => u.LastLoginTimeUtc.HasValue)), Times.Once);
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

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _controller.Login(loginRequest);

        // Assert
        result.Should().BeOfType<UnauthorizedObjectResult>();
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        unauthorizedResult.StatusCode.Should().Be(401);

        // Verify that password check was never called
        _mockSignInManager.Verify(x => x.CheckPasswordSignInAsync(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Never);
    }

    [Fact]
    public async Task Login_InvalidPassword_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "test@healthcare.com",
            Password = "WrongPassword123!"
        };

        var user = new User
        {
            EmailAddress = "test@healthcare.com",
            EmailConfirmed = true
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, loginRequest.Password, true))
            .ReturnsAsync(SignInResult.Failed);

        // Act
        var result = await _controller.Login(loginRequest);

        // Assert
        result.Should().BeOfType<UnauthorizedObjectResult>();
        var unauthorizedResult = (UnauthorizedObjectResult)result;
        unauthorizedResult.StatusCode.Should().Be(401);

        // Verify that token generation was never called
        _mockJwtService.Verify(x => x.GenerateTokenAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Login_UnconfirmedEmail_ReturnsBadRequest()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "unconfirmed@healthcare.com",
            Password = "SecurePass123!"
        };

        var user = new User
        {
            EmailAddress = "unconfirmed@healthcare.com",
            EmailConfirmed = false // Email not confirmed
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, loginRequest.Password, true))
            .ReturnsAsync(SignInResult.Success);

        // Act
        var result = await _controller.Login(loginRequest);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = (BadRequestObjectResult)result;
        badRequestResult.StatusCode.Should().Be(400);

        // Verify that token was never generated
        _mockJwtService.Verify(x => x.GenerateTokenAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Login_AccountLockedOut_ReturnsBadRequest()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "locked@healthcare.com",
            Password = "SecurePass123!"
        };

        var user = new User
        {
            EmailAddress = "locked@healthcare.com",
            EmailConfirmed = true
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, loginRequest.Password, true))
            .ReturnsAsync(SignInResult.LockedOut);

        // Act
        var result = await _controller.Login(loginRequest);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = (BadRequestObjectResult)result;
        badRequestResult.StatusCode.Should().Be(400);

        // Verify that token was never generated
        _mockJwtService.Verify(x => x.GenerateTokenAsync(It.IsAny<User>()), Times.Never);
    }

    #endregion

    #region Edge Cases and Security Tests

    [Fact]
    public async Task Login_UpdatesLastLoginTime()
    {
        // Arrange
        var loginRequest = new LoginRequest
        {
            Email = "test@healthcare.com",
            Password = "SecurePass123!"
        };

        var user = new User
        {
            FirstName = "Test",
            LastName = "User",
            EmailAddress = "test@healthcare.com",
            EmailConfirmed = true,
            ExternalId = Guid.NewGuid(),
            LastLoginTimeUtc = DateTime.UtcNow.AddDays(-1) // Previous login
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);

        _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, loginRequest.Password, true))
            .ReturnsAsync(SignInResult.Success);

        _mockJwtService.Setup(x => x.GenerateTokenAsync(user))
            .ReturnsAsync("token");

        _mockUserManager.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync([SystemRoles.Nurse]);

        _mockUserManager.Setup(x => x.UpdateAsync(user))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        await _controller.Login(loginRequest);

        // Assert
        _mockUserManager.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.LastLoginTimeUtc.HasValue &&
            u.LastLoginTimeUtc > DateTime.UtcNow.AddMinutes(-1))), Times.Once);
    }

    [Fact]
    public async Task Register_SetsCorrectUserProperties()
    {
        // Arrange
        var registerRequest = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Smith",
            Email = "john.smith@healthcare.com",
            Password = "SecurePass123!",
            PhoneNumber = "555-1234",
            UserType = "doctor"
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User?)null);

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), registerRequest.Password))
            .ReturnsAsync(IdentityResult.Success);

        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), SystemRoles.Doctor))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        await _controller.Register(registerRequest);

        // Assert
        _mockUserManager.Verify(x => x.CreateAsync(It.Is<User>(u =>
            u.FirstName == "John" &&
            u.LastName == "Smith" &&
            u.EmailAddress == "john.smith@healthcare.com" &&
            u.UserName == "john.smith@healthcare.com" &&
            u.MobileNumber == "555-1234" &&
            u.Type == "doctor" &&
            u.EmailConfirmed == false), registerRequest.Password), Times.Once);
    }

    #endregion
}