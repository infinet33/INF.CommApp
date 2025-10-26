## User Notification Preferences Implementation

### Overview
This document explains the notification preference system implemented for users in the healthcare communication application.

### Design Decision: Separate Table Approach

We chose to implement notification preferences using a **separate reference table** (`UserNotificationPreference`) rather than storing them as columns in the `Users` table.

#### Benefits of This Approach:

✅ **Extensible**: Easy to add new notification types without schema changes  
✅ **Flexible**: Different settings per notification type (JSON settings field)  
✅ **Maintainable**: Notification logic is isolated and queryable  
✅ **Scalable**: Can handle complex notification scenarios  
✅ **Audit-friendly**: Track when preferences were created/updated  

### Data Models

#### Updated User Model
```csharp
public class User
{
    // Required user information
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmailAddress { get; set; }
    public string? MobileNumber { get; set; }
    public string PasswordHash { get; set; }
    
    // Activity tracking
    public DateTime? LastLoginTimeUtc { get; set; }
    public DateTime CreatedOnUtc { get; set; }
    
    // Navigation to notification preferences
    public ICollection<UserNotificationPreference> NotificationPreferences { get; set; }
}
```

#### New UserNotificationPreference Model
```csharp
public class UserNotificationPreference
{
    public int Id { get; set; }
    public Guid ExternalId { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; }
    
    public string NotificationType { get; set; } // "email", "sms", "push", etc.
    public bool IsEnabled { get; set; }
    public string? Settings { get; set; } // JSON for type-specific settings
    
    public DateTime CreatedOnUtc { get; set; }
    public DateTime UpdatedOnUtc { get; set; }
}
```

### Predefined Notification Types

The `NotificationTypes` static class provides constants for common notification types:

- **email** - Email notifications
- **sms** - SMS/Text message notifications  
- **push** - Push notifications to mobile devices
- **in-app** - In-app notifications within the application
- **emergency** - Emergency notifications (highest priority)
- **medication-reminder** - Medication reminders
- **appointment-reminder** - Appointment reminders
- **care-plan-update** - Care plan updates
- **system-maintenance** - System maintenance notifications

### Database Constraints

1. **Unique External ID** - Each preference has a unique GUID for API security
2. **Unique User+NotificationType** - Prevents duplicate preferences for same user/type
3. **Foreign Key Cascade** - Deleting a user removes their preferences
4. **Indexed for Performance** - Efficient lookups by user and notification type

### Usage Examples

#### Creating Default Preferences for New Users
```csharp
var defaultPreferences = new[]
{
    new UserNotificationPreference 
    { 
        UserId = user.Id, 
        NotificationType = NotificationTypes.Email, 
        IsEnabled = true 
    },
    new UserNotificationPreference 
    { 
        UserId = user.Id, 
        NotificationType = NotificationTypes.Emergency, 
        IsEnabled = true 
    },
    new UserNotificationPreference 
    { 
        UserId = user.Id, 
        NotificationType = NotificationTypes.Sms, 
        IsEnabled = false 
    }
};
```

#### Using JSON Settings for Complex Preferences
```csharp
new UserNotificationPreference
{
    UserId = user.Id,
    NotificationType = NotificationTypes.Email,
    IsEnabled = true,
    Settings = JsonSerializer.Serialize(new
    {
        frequency = "daily_digest",
        quiet_hours = new { start = "22:00", end = "06:00" },
        categories = new[] { "appointments", "medications" }
    })
}
```

#### Querying User Preferences
```csharp
// Get all enabled notification types for a user
var enabledTypes = await context.UserNotificationPreferences
    .Where(p => p.UserId == userId && p.IsEnabled)
    .Select(p => p.NotificationType)
    .ToListAsync();

// Check if user has SMS enabled
var smsEnabled = await context.UserNotificationPreferences
    .AnyAsync(p => p.UserId == userId && 
                   p.NotificationType == NotificationTypes.Sms && 
                   p.IsEnabled);
```

### Migration Considerations

When implementing this system:

1. **Create migration** for the new table
2. **Seed default preferences** for existing users
3. **Update user registration** to create default preferences
4. **Modify notification service** to check preferences before sending

### API Endpoints (Recommended)

```
GET    /api/users/{id}/notification-preferences
PUT    /api/users/{id}/notification-preferences
POST   /api/users/{id}/notification-preferences/{type}/toggle
GET    /api/notification-types (returns available types)
```

### Security Notes

- External IDs used for API operations (never expose internal IDs)
- User can only modify their own preferences
- Admin users might have permission to view/modify others' preferences
- Audit trail via CreatedOnUtc/UpdatedOnUtc timestamps