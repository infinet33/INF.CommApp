# Authentication Implementation Guide

## Overview

Your User model is **already 95% ready** for authentication! Here's a comprehensive guide for implementing authentication in your healthcare communication system.

## Current User Model Status ✅

Your `User` model now includes all necessary authentication fields:

```csharp
public class User
{
    // Core identity
    public int Id { get; set; }
    public Guid ExternalId { get; set; } = Guid.NewGuid();
    
    // Required user information
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string EmailAddress { get; set; } = string.Empty;
    public string? MobileNumber { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    
    // Authentication & Security ✅ ADDED
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
    
    // Role-based authorization ✅ ADDED
    public ICollection<UserRole> UserRoles { get; set; } = [];
}
```

## 🏆 Recommended Authentication Approach: ASP.NET Core Identity + JWT

### Why This Approach?

✅ **HIPAA Compliant** - When configured properly  
✅ **Role-Based Authorization** - Perfect for healthcare roles (Nurse, Doctor, etc.)  
✅ **Built-in Security** - Password hashing, lockout, 2FA  
✅ **Mobile Friendly** - JWT tokens work great with mobile apps  
✅ **Scalable** - Works with your existing User model  

## Implementation Steps

### Step 1: Add Required Packages

Add these packages to `INF.CommApp.API.csproj`:

```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.9" />
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="9.0.9" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.1.2" />
```

### Step 2: Create Custom Identity User Store

Since you have a custom User model, create a custom `UserStore`:

```csharp
public class CustomUserStore : IUserStore<User>, IUserPasswordStore<User>, 
    IUserEmailStore<User>, IUserSecurityStampStore<User>, IUserLockoutStore<User>
{
    private readonly AppDbContext _context;
    
    public CustomUserStore(AppDbContext context)
    {
        _context = context;
    }
    
    // Implement interface methods...
}
```

### Step 3: Configure Authentication in Program.cs

```csharp
// Add Identity services
builder.Services.AddIdentity<User, Role>(options =>
{
    // Password settings for healthcare compliance
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!))
    };
});
```

### Step 4: Create Authentication Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return Unauthorized("Invalid credentials");
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);
        if (!result.Succeeded) return Unauthorized("Invalid credentials");
        
        var token = GenerateJwtToken(user);
        
        // Update last login time
        user.LastLoginTimeUtc = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);
        
        return Ok(new { Token = token, ExternalId = user.ExternalId });
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            EmailAddress = request.Email,
            UserName = request.Email,
            MobileNumber = request.PhoneNumber
        };
        
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        
        // Assign default role
        await _userManager.AddToRoleAsync(user, SystemRoles.ReadOnly);
        
        return Ok(new { Message = "User created successfully", ExternalId = user.ExternalId });
    }
    
    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.ExternalId.ToString()),
            new(ClaimTypes.Email, user.EmailAddress),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };
        
        // Add role claims
        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:Issuer"],
            audience: _configuration["JWT:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

## Healthcare-Specific Authorization

### Role-Based Access Control

Your system includes predefined roles perfect for healthcare:

```csharp
[Authorize(Roles = SystemRoles.Doctor + "," + SystemRoles.Nurse)]
public async Task<IActionResult> GetMedicalRecords(Guid residentId)
{
    // Only doctors and nurses can access medical records
}

[Authorize(Roles = SystemRoles.Administrator)]
public async Task<IActionResult> ManageUsers()
{
    // Only administrators can manage users
}
```

### Facility-Based Access Control

```csharp
[Authorize]
public async Task<IActionResult> GetResidents()
{
    var userId = User.GetUserId(); // Extension method to get user ID from claims
    var user = await _userService.GetByExternalIdAsync(userId);
    
    // Users can only see residents from their facility
    var residents = await _residentService.GetByFacilityAsync(user.FacilityId);
    return Ok(residents);
}
```

## Configuration Settings

Add to `appsettings.json`:

```json
{
  "JWT": {
    "Key": "your-super-secret-key-that-is-at-least-32-characters-long",
    "Issuer": "INF.CommApp.API",
    "Audience": "INF.CommApp.Clients",
    "ExpirationHours": 8
  },
  "PasswordPolicy": {
    "RequiredLength": 12,
    "RequireDigit": true,
    "RequireLowercase": true,
    "RequireUppercase": true,
    "RequireNonAlphanumeric": true
  }
}
```

## HIPAA Compliance Considerations

### 🔒 Security Features Included:

✅ **Strong Password Requirements** (12+ chars, complexity)  
✅ **Account Lockout** (5 failed attempts = 30 min lockout)  
✅ **Email Confirmation** Required for activation  
✅ **Security Stamps** For session invalidation  
✅ **Two-Factor Authentication** Support built-in  
✅ **External IDs** Never expose internal database IDs  
✅ **Audit Trail** Login times tracked  

### 🛡️ Additional HIPAA Requirements:

- **Encryption at Rest**: Ensure database encryption
- **Encryption in Transit**: HTTPS only (already configured)
- **Session Management**: Short JWT expiration (8 hours)
- **Audit Logging**: Log all access attempts
- **Role-Based Access**: Only authorized personnel access PHI

## Testing Your Authentication

### 1. Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "nurse@facility.com",
  "password": "SecurePassword123!"
}
```

### 2. Use JWT Token
```http
GET /api/facilities/residents
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Next Steps

1. **Install Packages** - Add the authentication NuGet packages
2. **Create UserStore** - Custom implementation for your User model
3. **Configure Program.cs** - Add Identity and JWT services
4. **Create AuthController** - Handle login/register/logout
5. **Add Authorization** - Protect your API endpoints
6. **Test Authentication** - Verify login/token generation works
7. **Add 2FA** - Implement two-factor authentication for admins

Your User model is ready - now you just need to wire up the authentication infrastructure!

## Alternative Approaches (If Needed)

### Option 2: Azure AD B2C
- Good for enterprise integration
- Handles user management externally
- More complex setup

### Option 3: Auth0 / Identity Server
- Third-party managed authentication
- Good for complex scenarios
- Additional cost

**Recommendation**: Start with ASP.NET Core Identity + JWT - it's the most straightforward for your existing setup.