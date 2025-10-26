using INF.CommApp.API.Extensions;
using INF.CommApp.API.Models;
using INF.CommApp.API.Services;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace INF.CommApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IJwtService jwtService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                User? user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    _logger.LogWarning("Login attempt with invalid email: {Email}", request.Email);
                    return Unauthorized(new { Message = "Invalid email or password" });
                }

                Microsoft.AspNetCore.Identity.SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

                if (!result.Succeeded)
                {
                    if (result.IsLockedOut)
                    {
                        _logger.LogWarning("User account locked out: {Email}", request.Email);
                        return BadRequest(new { Message = "Account is locked out. Please try again later." });
                    }

                    _logger.LogWarning("Invalid password attempt for user: {Email}", request.Email);
                    return Unauthorized(new { Message = "Invalid email or password" });
                }

                if (!user.EmailConfirmed)
                {
                    return BadRequest(new { Message = "Email address is not confirmed. Please check your email." });
                }

                // Generate JWT token
                string token = await _jwtService.GenerateTokenAsync(user);
                IList<string> roles = await _userManager.GetRolesAsync(user);

                // Update last login time
                user.LastLoginTimeUtc = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);

                _logger.LogInformation("Successful login for user: {Email}", request.Email);

                return Ok(new LoginResponse
                {
                    Token = token,
                    ExternalId = user.ExternalId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.EmailAddress,
                    Roles = roles.ToArray(),
                    ExpiresAt = DateTime.UtcNow.AddHours(8) // This should match your JWT expiration
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
                return StatusCode(500, new { Message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if user already exists
                User? existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { Message = "User with this email already exists" });
                }

                User user = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    EmailAddress = request.Email,
                    UserName = request.Email, // Use email as username
                    MobileNumber = request.PhoneNumber,
                    Type = request.UserType,
                    EmailConfirmed = false // In production, you'd send a confirmation email
                };

                Microsoft.AspNetCore.Identity.IdentityResult result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        Message = "Failed to create user",
                        Errors = result.Errors.Select(e => e.Description).ToArray()
                    });
                }

                // Assign default role based on user type or default to ReadOnly
                string defaultRole = GetDefaultRoleForUserType(request.UserType);
                await _userManager.AddToRoleAsync(user, defaultRole);

                _logger.LogInformation("User registered successfully: {Email}", request.Email);

                return Ok(new
                {
                    Message = "User created successfully",
                    ExternalId = user.ExternalId,
                    Note = "Please confirm your email address to complete registration"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
                return StatusCode(500, new { Message = "An error occurred during registration" });
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                int userId = User.GetInternalUserId();
                User? user = await _userManager.FindByIdAsync(userId.ToString(System.Globalization.CultureInfo.InvariantCulture));

                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                Microsoft.AspNetCore.Identity.IdentityResult result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        Message = "Failed to change password",
                        Errors = result.Errors.Select(e => e.Description).ToArray()
                    });
                }

                _logger.LogInformation("Password changed successfully for user: {Email}", user.EmailAddress);

                return Ok(new { Message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for user: {UserId}", User.GetUserId());
                return StatusCode(500, new { Message = "An error occurred while changing password" });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
                _logger.LogInformation("User logged out: {UserId}", User.GetUserId());
                return Ok(new { Message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout for user: {UserId}", User.GetUserId());
                return StatusCode(500, new { Message = "An error occurred during logout" });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                int userId = User.GetInternalUserId();
                User? user = await _userManager.FindByIdAsync(userId.ToString(System.Globalization.CultureInfo.InvariantCulture));

                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }

                IList<string> roles = await _userManager.GetRolesAsync(user);

                return Ok(new
                {
                    ExternalId = user.ExternalId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.EmailAddress,
                    PhoneNumber = user.MobileNumber,
                    UserType = user.Type,
                    Roles = roles.ToArray(),
                    EmailConfirmed = user.EmailConfirmed,
                    PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                    TwoFactorEnabled = user.TwoFactorEnabled,
                    LastLoginTimeUtc = user.LastLoginTimeUtc,
                    CreatedOnUtc = user.CreatedOnUtc
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile for user: {UserId}", User.GetUserId());
                return StatusCode(500, new { Message = "An error occurred while getting profile" });
            }
        }

        private static string GetDefaultRoleForUserType(string userType)
        {
            return userType.ToLower() switch
            {
                "admin" => SystemRoles.Administrator,
                "administrator" => SystemRoles.Administrator,
                "sysadmin" => SystemRoles.Administrator,
                "systemadmin" => SystemRoles.Administrator,
                "facilityadmin" => SystemRoles.FacilityAdmin,
                "facility_admin" => SystemRoles.FacilityAdmin,
                "facilitymanager" => SystemRoles.FacilityManager,
                "facility_manager" => SystemRoles.FacilityManager,
                "manager" => SystemRoles.FacilityManager,
                "billingadmin" => SystemRoles.BillingAdmin,
                "billing_admin" => SystemRoles.BillingAdmin,
                "billing" => SystemRoles.BillingAdmin,
                "doctor" => SystemRoles.Doctor,
                "nurse" => SystemRoles.Nurse,
                "lpn" => SystemRoles.LPN,
                "cna" => SystemRoles.CNA,
                "caregiver" => SystemRoles.Caregiver,
                "pharmacist" => SystemRoles.Pharmacist,
                "physicaltherapist" => SystemRoles.PhysicalTherapist,
                "occupationaltherapist" => SystemRoles.OccupationalTherapist,
                "socialworker" => SystemRoles.SocialWorker,
                "resident" => SystemRoles.Resident,
                "familymember" => SystemRoles.FamilyMember,
                "family_member" => SystemRoles.FamilyMember,
                "family" => SystemRoles.FamilyMember,
                _ => SystemRoles.ReadOnly
            };
        }
    }
}