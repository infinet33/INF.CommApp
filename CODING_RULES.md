# INF.CommApp Coding Standards

This document defines the coding standards for the INF.CommApp healthcare communication system. These standards are enforced through `.editorconfig` and `Directory.Build.props` files.

### Classes and Interfaces
- **Classes**: Use PascalCase - `FacilityController`, `NotificationService`
- **Interfaces**: Prefix with 'I' - `INotificationService`, `IUserRepository`
- **Data Access**: Suffix with `DataAccess` - `FacilityDataAccess`
- **Services**: Suffix with `Service` - `NotificationService`
- **Entities**: Use singular names - `User`, `Facility`, `Resident`

### Methods and Properties
- **Public Methods**: PascalCase - `CreateFacility()`, `GetUserById()`
- **Private Methods**: PascalCase - `ValidateInput()`, `ProcessNotification()`
- **Properties**: PascalCase - `UserId`, `FacilityName`
- **Auto-Properties**: Preferred over backing fields

### Variables and Parameters
- **Local Variables**: camelCase with full descriptive names - `facility`, `notification`, `userNotificationPreferences`
- **Method Parameters**: camelCase with full names - `public void CreateUser(int userId, string userName)`
- **Private Fields**: Prefix with underscore, full names - `_dbContext`, `_logger`, `_notificationService`
- **Constants**: PascalCase with full names - `MaxRetryAttempts`, `DefaultTimeoutInSeconds`
- **No Abbreviations**: Use `facility` not `f`, `user` not `u`, `notification` not `notif`

### Example:
```csharp
public class NotificationService : INotificationService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<NotificationService> _logger;
    private const int MaxRetryAttempts = 3;

    public async Task<NotificationResult> SendNotificationAsync(int userId, string message)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        // Implementation
    }
}
```

## Project Structure

### Solution Architecture
```
INF.CommApp/
├── INF.CommApp.Api/          # Web API controllers and endpoints
├── INF.CommApp.BLL/          # Business logic layer
├── INF.CommApp.DATA/         # Data access layer (EF Core)
├── INF.CommApp.Web/          # Web application (if needed)
└── INF.CommApp.MAUI/         # Mobile application
```

### File Organization
- **Controllers**: `INF.CommApp.Api/Controllers/` - REST API endpoints
- **Services**: `INF.CommApp.BLL/Services/` - Business logic implementation  
- **Models**: `INF.CommApp.DATA/Models/` - Entity Framework models
- **Interfaces**: `INF.CommApp.BLL/Interfaces/` - Service contracts
- **Extensions**: `INF.CommApp.BLL/Extensions/` - DI configuration

## Code Style

### Variable Declarations
```csharp
// ✅ Good - always use explicit types (no var)
string userName = "john.doe";
List<User> users = new List<User>();
User user = await _dbContext.Users.FindAsync(id);
NotificationResult result = PerformCalculation();
int count = 5;

// ❌ Avoid - using var anywhere
var user = await _dbContext.Users.FindAsync(id);
var result = PerformCalculation();
var count = 5;
```

### Method Structure
```csharp
// ✅ Preferred - async methods with explicit types and full variable names
public async Task<IActionResult> CreateFacility([FromBody] FacilityDto facilityDto)
{
    if (facilityDto == null)
        return BadRequest("Facility data is required");

    Facility facility = new Facility
    {
        Name = facilityDto.Name,
        Address = facilityDto.Address,
        // ... other properties
    };

    _dbContext.Facilities.Add(facility);
    await _dbContext.SaveChangesAsync();

    return CreatedAtAction(nameof(GetFacility), new { id = facility.Id }, facility);
}
```

### Nullable Reference Types
- **Required**: All projects use `<Nullable>enable</Nullable>`
- **DTOs**: Use required properties or nullable types appropriately
```csharp
// ✅ Good - required properties
public class FacilityDto
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public string? Description { get; set; } // Optional
}

// ✅ Good - constructor initialization  
public class User
{
    public User(string userName, string type)
    {
        UserName = userName;
        Type = type;
        UserResidents = new List<UserResident>();
    }

    public string UserName { get; set; }
    public string Type { get; set; }
    public List<UserResident> UserResidents { get; set; }
}
```

## Dependency Injection

### Service Registration
```csharp
// Program.cs - Register services by lifetime
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
```

### Constructor Injection
```csharp
public class FacilityController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<FacilityController> _logger;

    public FacilityController(AppDbContext dbContext, ILogger<FacilityController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }
}
```

## Documentation

### Inline Comments (Use Sparingly)
```csharp
// Only use when business logic is complex or non-obvious
public async Task<bool> ValidateUserAccess(int userId, int residentId)
{
    // Check if user has direct assignment to resident
    bool directAccess = await _dbContext.UserResidents
        .AnyAsync(userResident => userResident.UserId == userId && userResident.ResidentId == residentId);
    
    if (directAccess) return true;
    
    // Fall back to agency-level access if user belongs to facility's agency
    // This supports temporary staff assignments
    return await CheckAgencyAccess(userId, residentId);
}
```

## Error Handling

### Controller Error Handling
```csharp
[HttpPost]
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    try
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
    catch (ValidationException ex)
    {
        _logger.LogWarning("Validation failed for user creation: {Error}", ex.Message);
        return BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Unexpected error creating user");
        return StatusCode(500, "An error occurred while creating the user");
    }
}
```

### Service Layer Error Handling
```csharp
public async Task<User> CreateUserAsync(CreateUserDto dto)
{
    try
    {
        // Validation logic
        await ValidateUserData(dto);
        
        // Business logic
        var user = new User(dto.UserName, dto.Type);
        
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        
        _logger.LogInformation("User created successfully: {UserId}", user.Id);
        return user;
    }
    catch (DbUpdateException ex)
    {
        _logger.LogError(ex, "Database error creating user: {UserName}", dto.UserName);
        throw new InvalidOperationException("Unable to create user due to database constraints", ex);
    }
}
```

## Performance Guidelines

### Database Operations
```csharp
// ✅ Good - async operations
var users = await _dbContext.Users
    .Where(u => u.AgencyId == agencyId)
    .ToListAsync();

// ✅ Good - include related data explicitly
var facility = await _dbContext.Facilities
    .Include(f => f.Residents)
    .FirstOrDefaultAsync(f => f.Id == id);

// ❌ Avoid - N+1 queries
foreach (var user in users)
{
    var residents = await _dbContext.UserResidents
        .Where(ur => ur.UserId == user.Id)
        .ToListAsync(); // This creates N+1 queries
}
```

### Memory Management
```csharp
// ✅ Good - dispose resources
using var scope = _serviceProvider.CreateScope();
var service = scope.ServiceProvider.GetRequiredService<INotificationService>();

// ✅ Good - streaming large datasets
public async IAsyncEnumerable<Notification> GetNotificationsStreamAsync(int facilityId)
{
    await foreach (var notification in _dbContext.Notifications
        .Where(n => n.FacilityId == facilityId)
        .AsAsyncEnumerable())
    {
        yield return notification;
    }
}
```

## Configuration Management

### Constants and Magic Values
```csharp
// ✅ Good - configuration-driven
public class NotificationSettings
{
    public const string SectionName = "NotificationSettings";
    public int MaxRetryAttempts { get; set; } = 3;
    public TimeSpan RetryDelay { get; set; } = TimeSpan.FromSeconds(5);
    public int BatchSize { get; set; } = 100;
}

// ✅ Good - inject configuration
public NotificationService(IOptions<NotificationSettings> settings)
{
    _settings = settings.Value;
}
```

## Enforcement

These standards are automatically enforced through:

1. **`.editorconfig`** - IDE formatting and style rules
2. **`Directory.Build.props`** - Compiler warnings and code analysis
3. **Build Process** - Warnings as errors for critical violations

### VS Code Integration
The C# Dev Kit extension will automatically apply these rules. Use:
- `Ctrl+K, Ctrl+D` - Format document
- `Ctrl+.` - Quick fixes and refactoring suggestions

### Manual Validation
```bash
# Check for formatting issues
dotnet format --verify-no-changes

# Build with all warnings
dotnet build --verbosity normal
```