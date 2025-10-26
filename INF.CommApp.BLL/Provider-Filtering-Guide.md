# Provider Filtering & User Preferences - Complete Guide

## 🎯 **How Provider Filtering Works (3 Levels)**

### **Level 1: System Configuration (App-wide)**
Only providers with valid configuration get registered:

```json
// appsettings.json
{
  "Twilio": {
    "AccountSid": "your-account-sid",    // ✅ Required for SMS
    "AuthToken": "your-auth-token",      // ✅ Required for SMS  
    "FromNumber": "+1234567890"          // ✅ Required for SMS
  },
  "Firebase": {
    // 🚫 Missing - Push notifications won't be available
  }
}
```

**Result**: Only SMS provider gets registered, Push/IVR remain unavailable system-wide.

---

### **Level 2: User Preferences (Individual Settings)**
Each user can enable/disable specific channels:

```csharp
// User's notification preferences
var userPrefs = new UserNotificationPreferences
{
    UserId = 123,
    SmsEnabled = true,     // ✅ User wants SMS
    PushEnabled = false,   // 🚫 User disabled Push
    IvrEnabled = false,    // 🚫 User disabled IVR
    EmailEnabled = true,   // ✅ User wants Email
    
    // Quiet hours: no non-urgent notifications 10 PM - 6 AM
    QuietHoursStart = new TimeSpan(22, 0, 0),
    QuietHoursEnd = new TimeSpan(6, 0, 0),
    MinimumUrgentPriority = NotificationPriority.High
};
```

---

### **Level 3: Request-Time Filtering**
Final channel selection combines system + user preferences:

```csharp
// Developer requests multiple channels
var request = new NotificationRequest
{
    Message = "Resident needs assistance",
    Priority = NotificationPriority.Medium,
    Channels = NotificationChannel.SMS | NotificationChannel.Push | NotificationChannel.IVR,
    Recipients = new List<string> { "+1234567890" }
};

// System applies filtering:
// 1. System has: SMS ✅, Push 🚫, IVR 🚫
// 2. User wants: SMS ✅, Push 🚫, IVR 🚫  
// 3. Final result: SMS ONLY ✅
```

## 🔍 **Real-World Examples**

### **Example 1: SMS-Only User**

**User Setup:**
```csharp
var nursePrefs = new UserNotificationPreferences
{
    UserId = 101,
    SmsEnabled = true,    // ✅ Only SMS enabled
    PushEnabled = false,
    IvrEnabled = false,
    EmailEnabled = false
};
```

**Request:**
```csharp
await notificationService.SendToResidentCareTeamAsync(
    residentId: 456,
    message: "Patient fall detected",
    priority: NotificationPriority.High,
    channels: NotificationChannel.All  // Developer requests ALL channels
);
```

**What Happens:**
1. ✅ **SMS sent** - System configured + User enabled
2. 🚫 **Push skipped** - User disabled  
3. 🚫 **IVR skipped** - User disabled
4. 🚫 **Email skipped** - User disabled

**Log Output:**
```
[INFO] SMS sent successfully to +1234567890, SID: SM123...
[INFO] No enabled channels for Push notifications for user 101
[INFO] User 101 final channels: SMS (filtered from All)
```

---

### **Example 2: Quiet Hours Filtering**

**User Setup:**
```csharp
var caregiverPrefs = new UserNotificationPreferences
{
    UserId = 102,
    SmsEnabled = true,
    PushEnabled = true,
    QuietHoursStart = new TimeSpan(22, 0, 0),  // 10 PM
    QuietHoursEnd = new TimeSpan(6, 0, 0),     // 6 AM
    MinimumUrgentPriority = NotificationPriority.High
};
```

**Scenario 1: 11 PM, Medium Priority**
```csharp
// At 11 PM - during quiet hours
var result = await notificationService.SendToResidentCareTeamAsync(
    residentId: 456,
    message: "Medication reminder",
    priority: NotificationPriority.Medium,  // Not urgent enough
    channels: NotificationChannel.SMS
);
```
**Result:** 🚫 **No notification sent** - Quiet hours + low priority

**Scenario 2: 11 PM, High Priority**
```csharp
// At 11 PM - during quiet hours
var result = await notificationService.SendToResidentCareTeamAsync(
    residentId: 456, 
    message: "Emergency - patient unresponsive",
    priority: NotificationPriority.High,  // Urgent - overrides quiet hours
    channels: NotificationChannel.SMS
);
```
**Result:** ✅ **SMS sent** - High priority overrides quiet hours

---

### **Example 3: Role-Based Defaults**

**Automatic Defaults by User Type:**
```csharp
// Nurse gets IVR enabled by default
var nurse = new User { Type = "nurse" };
// Default: SMS ✅, Push ✅, IVR ✅, Email ✅

// Caregiver gets basic notifications
var caregiver = new User { Type = "caregiver" };  
// Default: SMS ✅, Push ✅, IVR 🚫, Email ✅

// Administrator gets quiet hours
var admin = new User { Type = "administrator" };
// Default: SMS ✅, Push ✅, IVR 🚫, Email ✅, Quiet Hours: 6 PM - 8 AM
```

## 🛠️ **Configuration Examples**

### **Development Environment (SMS Only)**
```json
{
  "Twilio": {
    "AccountSid": "test-sid",
    "AuthToken": "test-token", 
    "FromNumber": "+15551234567"
  }
  // No Firebase/Push config = Push notifications unavailable
}
```

### **Production Environment (All Channels)**
```json
{
  "Twilio": {
    "AccountSid": "prod-sid",
    "AuthToken": "prod-token",
    "FromNumber": "+15551234567"  
  },
  "Firebase": {
    "ServerKey": "firebase-server-key",
    "ProjectId": "your-project-id"
  },
  "Smtp": {
    "Host": "smtp.office365.com",
    "Username": "notifications@facility.com",
    "Password": "email-password"
  }
}
```

## 🔧 **User Preference Management**

### **API Endpoints (Future Enhancement)**
```csharp
[HttpGet("api/users/{userId}/notification-preferences")]
public async Task<UserNotificationPreferences> GetPreferences(int userId)
{
    return await _preferencesService.GetUserPreferencesAsync(userId);
}

[HttpPut("api/users/{userId}/notification-preferences")]  
public async Task<UserNotificationPreferences> UpdatePreferences(
    int userId, 
    [FromBody] UserNotificationPreferences preferences)
{
    return await _preferencesService.UpdateUserPreferencesAsync(userId, preferences);
}
```

### **MAUI App Settings Screen (Future)**
```csharp
// Toggle switches for each channel
SmsToggle.IsToggled = preferences.SmsEnabled;
PushToggle.IsToggled = preferences.PushEnabled; 
IvrToggle.IsToggled = preferences.IvrEnabled;

// Time pickers for quiet hours
QuietStartTimePicker.Time = preferences.QuietHoursStart;
QuietEndTimePicker.Time = preferences.QuietHoursEnd;
```

## 📊 **Monitoring & Analytics**

The system logs detailed information about filtering decisions:

```csharp
// Logs show filtering decisions
[INFO] User 101 preferences: SMS=true, Push=false, IVR=false
[INFO] Requested channels: SMS|Push|IVR, Final channels: SMS  
[INFO] Skipping notification for user 102 due to quiet hours (priority: Medium)
[INFO] Batch notification completed. Sent: 3, Filtered: 2, Failed: 0
```

This multi-level filtering ensures users only receive notifications through their preferred channels while respecting system capabilities and user settings! 🎯