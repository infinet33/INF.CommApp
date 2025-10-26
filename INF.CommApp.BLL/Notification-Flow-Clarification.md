# Healthcare Notification Flow - Clarification

## 🏥 **Important Clarification: Who Gets Notifications**

### ❌ **INCORRECT Understanding:**
- ~~Residents receive notifications~~
- ~~Notifications are sent TO residents~~

### ✅ **CORRECT Understanding:**
- **Residents** generate events that create notifications
- **Notifications** are **ABOUT** residents but sent **TO** care team members
- **Care team members** receive the notifications and respond
- **Notifications** are tracked in the resident's chart/history for continuity of care

---

## 🔄 **Actual Notification Flow**

### **Step 1: Event Occurs**
```
🏥 Facility: "Sunset Manor"
👤 Resident: "John Smith" (Room 204)
🚨 Event: Fall detected, vitals abnormal, medication due, etc.
```

### **Step 2: Notification Created**
```csharp
// System creates notification ABOUT the resident
var notification = new NotificationRequest
{
    AboutResidentId = 123,           // John Smith's ID
    FacilityId = 456,               // Sunset Manor
    Message = "John Smith (Room 204) - Fall detected, assistance needed",
    Priority = NotificationPriority.High
};
```

### **Step 3: Care Team Identified**
```sql
-- Find who is assigned to care for John Smith
SELECT u.* FROM Users u
JOIN UserResidents ur ON u.Id = ur.UserId  
WHERE ur.ResidentId = 123  -- John Smith
```

**Care Team Found:**
- 👩‍⚕️ Nurse Sarah (Primary)
- 👨‍⚕️ CNA Mike (Secondary) 
- 🩺 Dr. Johnson (On-call)

### **Step 4: Notifications Sent TO Care Team**
```
📱 SMS to Nurse Sarah: "[Sunset Manor] John Smith (Room 204) - Fall detected, assistance needed"
📱 SMS to CNA Mike: "[Sunset Manor] John Smith (Room 204) - Fall detected, assistance needed"  
📞 IVR to Dr. Johnson: Voice call with same message
```

### **Step 5: Response & Documentation**
```
✅ Nurse Sarah responds to Room 204
✅ Incident logged in John Smith's chart
✅ Notification outcome tracked for audit
```

---

## 💾 **Database Records Created**

### **Notifications Table**
```sql
INSERT INTO Notifications (Message, Priority, CreatedAt, FacilityId)
VALUES ('John Smith (Room 204) - Fall detected, assistance needed', 
        'High', '2025-10-25 14:30:00', 456);
```

### **NotificationSubscriptions Table** (Delivery Tracking)
```sql
-- Track who received the notification
INSERT INTO NotificationSubscriptions (UserId, NotificationId)
VALUES (101, 789), -- Nurse Sarah received notification
       (102, 789), -- CNA Mike received notification  
       (103, 789); -- Dr. Johnson received notification
```

### **Chart/History Linkage** (Future Enhancement)
```sql
-- Link notification to resident's care history
INSERT INTO ResidentNotificationHistory (ResidentId, NotificationId, CreatedBy)
VALUES (123, 789, 'SYSTEM');
```

---

## 🎯 **Key Points**

### **Recipients Are Always Care Team Members:**
- ✅ Nurses, CNAs, Doctors, Caregivers
- ✅ Family members (if configured)
- ✅ Facility administrators
- ❌ **Never the residents themselves**

### **Content Is Always About Residents:**
- ✅ "John needs medication"
- ✅ "Mary fell in bathroom" 
- ✅ "Robert's vitals are abnormal"
- ✅ "Sarah hasn't eaten today"

### **Purpose Is Care Coordination:**
- ✅ Alert care team to respond
- ✅ Document incident in resident's history
- ✅ Ensure continuity of care
- ✅ Maintain audit trail for compliance

---

## 📋 **Real-World Examples**

### **Example 1: Medication Reminder**
```csharp
// About: Resident needs evening medication
// To: Assigned nurse for that shift
await notificationService.SendAboutResidentToCareTeamAsync(
    residentId: 456,
    message: "Evening medication due: Metformin 500mg",
    priority: NotificationPriority.Medium,
    channels: NotificationChannel.Push // Mobile app notification
);
```

### **Example 2: Emergency Situation**
```csharp
// About: Resident had a fall
// To: All assigned care team members
await notificationService.SendAboutResidentToCareTeamAsync(
    residentId: 789, 
    message: "FALL ALERT: Found on floor in bathroom, conscious and alert",
    priority: NotificationPriority.High,
    channels: NotificationChannel.SMS | NotificationChannel.IVR
);
```

### **Example 3: Family Update**
```csharp
// About: Resident's condition update
// To: Family members (future feature)
await notificationService.SendAboutResidentToCareTeamAsync(
    residentId: 123,
    message: "Daily update: Good day, participated in activities, ate well",
    priority: NotificationPriority.Low,
    channels: NotificationChannel.Email
);
```

---

## 🔍 **Chart Integration (Future Enhancement)**

```csharp
// When notification is created, also create chart entry
public async Task<NotificationBatchResult> SendAboutResidentToCareTeamAsync(...)
{
    // 1. Send notifications to care team
    var result = await SendNotifications(...);
    
    // 2. Add entry to resident's chart
    var chartEntry = new ResidentChartEntry
    {
        ResidentId = residentId,
        EntryType = ChartEntryType.Notification,
        Content = $"Alert sent to care team: {message}",
        CreatedAt = DateTime.UtcNow,
        CreatedBy = "NOTIFICATION_SYSTEM"
    };
    
    await _context.ResidentChartEntries.Add(chartEntry);
    await _context.SaveChangesAsync();
    
    return result;
}
```

This ensures every notification becomes part of the resident's permanent care record! 📋