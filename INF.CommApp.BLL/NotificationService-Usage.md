# NotificationService - Usage Guide

## 🎯 Purpose
The NotificationService provides an abstracted way to send notifications through multiple channels (SMS, Push, IVR) with Twilio SMS integration and extensibility for future providers.

## 🚀 Setup

### 1. Add to Program.cs (API or Web project)
```csharp
using INF.CommApp.BLL.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add notification services
builder.Services.AddNotificationServices();

var app = builder.Build();

// Configure providers at startup
using (var scope = app.Services.CreateScope())
{
    var configurator = scope.ServiceProvider.GetRequiredService<INotificationServiceConfigurator>();
    var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
    await configurator.ConfigureProvidersAsync(notificationService);
}
```

### 2. Configuration (appsettings.json or Azure Key Vault)
```json
{
  "Twilio": {
    "AccountSid": "your-twilio-account-sid",
    "AuthToken": "your-twilio-auth-token", 
    "FromNumber": "+1234567890"
  }
}
```

### 3. Azure Key Vault Configuration (Recommended for Production)
```json
{
  "Twilio:AccountSid": "stored-in-key-vault",
  "Twilio:AuthToken": "stored-in-key-vault",
  "Twilio:FromNumber": "stored-in-key-vault"
}
```

## 📱 Usage Examples

### Basic SMS Notification
```csharp
public class ResidentController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public ResidentController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost("emergency/{residentId}")]
    public async Task<IActionResult> SendEmergencyAlert(int residentId)
    {
        // Emergency notification ABOUT resident sent TO their care team
        var result = await _notificationService.SendAboutResidentToCareTeamAsync(
            residentId,
            "Emergency alert: Immediate attention required", 
            NotificationPriority.High,
            NotificationChannel.SMS
        );
        
        if (result.AllSuccessful)
        {
            return Ok($"Emergency alert about resident {residentId} sent to {result.TotalSent} care team members");
        }
        
        return BadRequest($"Alert failed. Sent: {result.TotalSent}, Failed: {result.TotalFailed}");
    }
}
```

### Send Notification About Resident to Care Team
```csharp
[HttpPost("resident/{residentId}/notify")]
public async Task<IActionResult> NotifyAboutResident(int residentId, [FromBody] string message)
{
    // This sends a notification ABOUT the resident TO their care team members
    // The notification gets tracked in the resident's chart/history
    var result = await _notificationService.SendAboutResidentToCareTeamAsync(
        residentId, 
        message, 
        NotificationPriority.Medium,
        NotificationChannel.SMS | NotificationChannel.Push
    );

    return Ok(new { 
        AboutResidentId = residentId,
        SentToCareTeamMembers = result.TotalSent, 
        Failed = result.TotalFailed,
        Details = result.Results 
    });
}
```

### Facility-Wide Alert
```csharp
[HttpPost("facility/{facilityId}/alert")]
public async Task<IActionResult> SendFacilityAlert(int facilityId, [FromBody] AlertRequest alert)
{
    var result = await _notificationService.SendFacilityNotificationAsync(
        facilityId,
        alert.Message,
        alert.Priority,
        NotificationChannel.All
    );

    return Ok(new { 
        Message = "Facility alert processed",
        Sent = result.TotalSent,
        Failed = result.TotalFailed
    });
}
```

## 🔌 Available Channels

| Channel | Status | Provider | Notes |
|---------|--------|----------|-------|
| SMS | ✅ Active | Twilio | Requires Twilio configuration |
| Push | 🚧 Future | MAUI | For mobile app notifications |
| IVR | 🚧 Future | Twilio Voice | For voice calls |
| Email | 🚧 Future | SendGrid/SMTP | For email notifications |

## 🔧 Adding New Providers

### Create Provider Class
```csharp
public class EmailProvider : INotificationProvider
{
    public NotificationChannel SupportedChannel => NotificationChannel.Email;
    public bool IsConfigured { get; private set; }

    public async Task<NotificationResult> SendAsync(NotificationRequest request)
    {
        // Implement email sending logic
    }

    public async Task<NotificationBatchResult> SendBatchAsync(List<NotificationRequest> requests)
    {
        // Implement batch email sending
    }
}
```

### Register in DI Container
```csharp
services.AddScoped<EmailProvider>();
```

### Add to Configurator
```csharp
notificationService.RegisterProvider(emailProvider);
```

## 🔍 Monitoring & Logging

The service automatically logs:
- ✅ Successful sends with provider details
- ❌ Failed attempts with error codes
- 📊 Batch operation summaries
- 🗄️ Database audit trail

### Example Log Output
```
[INFO] Registered notification provider for SMS
[INFO] SMS sent successfully to +1234567890, SID: SM1234567890abcdef
[ERROR] Failed to send SMS to +invalid: Invalid phone number format
[INFO] Batch notification completed. Total sent: 5, Total failed: 1
```

## 🚀 Future Enhancements

1. **MAUI Push Notifications**: Integration with Firebase/APNS
2. **IVR Calls**: Twilio Voice API for automated calls  
3. **Email Notifications**: SendGrid or SMTP integration
4. **WhatsApp**: Twilio WhatsApp Business API
5. **Retry Logic**: Automatic retry for failed notifications
6. **Rate Limiting**: Prevent spam and manage API limits
7. **Templates**: Predefined message templates
8. **Scheduling**: Delayed and scheduled notifications

## 🔒 Security Considerations

- ✅ Store Twilio credentials in Azure Key Vault
- ✅ Validate phone numbers before sending
- ✅ Log all notification attempts for audit
- ✅ Rate limiting to prevent abuse
- ✅ Encrypt sensitive data in logs
- ✅ Use HTTPS for all external API calls