# INF.CommApp.DATA - Detailed Entity Specifications

**Complete technical specifications of all data entities with C# implementations.**

## 🎯 Purpose
This document provides **detailed technical specifications** of each entity, including actual C# code, properties, relationships, and database mappings.

## 🗃️ Database Tables Overview

| Table | Type | Purpose | Key Relationships |
|-------|------|---------|-------------------|
| `Facilities` | Core | Care facilities (PRIMARY) | → Residents, Notifications |
| `Residents` | Core | Patients/clients | ← Facility, ↔ Users |
| `Users` | Core | Healthcare staff | ↔ Residents, Notifications |
| `Notifications` | Core | Alerts/messages | ← Facility, ↔ Users |
| `UserResidents` | Junction | Care assignments | User ↔ Resident |
| `NotificationSubscriptions` | Junction | Alert subscriptions | User ↔ Notification |
| `Agencies` | Optional | Healthcare agencies | → Users |

## 📅 Last Updated
**Auto-sync required:** Update this document when modifying any `INF.CommApp.DATA.Models` classes.

## 🔄 Database Update Workflow

### After making model changes:
```powershell
# 1. Navigate to DATA project
cd "C:\Users\jeato\OneDrive\Source\INF.CommApp\INF.CommApp.DATA"

# 2. Create migration with descriptive name
dotnet ef migrations add [DescriptiveName] --project INF.CommApp.DATA.csproj

# 3. Review generated migration files in Migrations/ folder

# 4. Apply to database
dotnet ef database update --project INF.CommApp.DATA.csproj

# 5. Update this documentation to reflect changes
```

### Common Migration Commands:
```powershell
# List all migrations
dotnet ef migrations list --project INF.CommApp.DATA.csproj

# Remove last migration (if not yet applied to database)
dotnet ef migrations remove --project INF.CommApp.DATA.csproj

# Rollback to specific migration
dotnet ef database update [MigrationName] --project INF.CommApp.DATA.csproj

# Generate SQL script for migration
dotnet ef migrations script --project INF.CommApp.DATA.csproj
```

## 🏥 Core Entity: Facility (PRIMARY)

**File:** `Models/Facility.cs` | **Table:** `Facilities`

```csharp
public class Facility
{
    public int Id { get; set; }                    // Primary Key
    public string Name { get; set; }               // Facility name
    public string Address { get; set; }            // Street address
    public string City { get; set; }               // City
    public string State { get; set; }              // State/Province
    public string Zip { get; set; }                // Postal code
    public ICollection<Resident> Residents { get; set; }  // Navigation property
}
```

**Relationships:**
- **1:Many** → Residents (houses patients/clients)
- **1:Many** → Notifications (generates alerts)

---

## 👥 Core Entity: Resident

**File:** `Models/Resident.cs` | **Table:** `Residents`

```csharp
public class Resident
{
    public int Id { get; set; }                    // Primary Key
    public string FirstName { get; set; }          // First name
    public string LastName { get; set; }           // Last name
    public int FacilityId { get; set; }            // Foreign Key → Facility
    public Facility Facility { get; set; }        // Navigation property
    public ICollection<UserResident> UserResidents { get; set; }  // Many-to-many with Users
}
```

**Relationships:**
- **Many:1** ← Facility (lives at facility)
- **Many:Many** ↔ Users via UserResidents (receives care from staff)

---

## 👨‍⚕️ Core Entity: User (Staff)

**File:** `Models/User.cs` | **Table:** `Users`

```csharp
public class User
{
    public int Id { get; set; }                    // Primary Key
    public string UserName { get; set; }           // Username/login
    public string Type { get; set; }               // Role: nurse, caregiver, doctor, etc.
    public int? AgencyId { get; set; }             // Foreign Key → Agency (nullable)
    public Agency Agency { get; set; }             // Navigation property
    public ICollection<UserResident> UserResidents { get; set; }           // Many-to-many with Residents
    public ICollection<NotificationSubscription> NotificationSubscriptions { get; set; }  // Many-to-many with Notifications
}
```

**Relationships:**
- **Many:1** ← Agency (optionally employed by agency)
- **Many:Many** ↔ Residents via UserResidents (provides care)
- **Many:Many** ↔ Notifications via NotificationSubscriptions (receives alerts)

---

## 📢 Core Entity: Notification

**File:** `Models/Notification.cs` | **Table:** `Notifications`

```csharp
public class Notification
{
    public int Id { get; set; }                    // Primary Key
    public string Message { get; set; }            // Alert message content
    public NotificationPriority Priority { get; set; }  // Priority level (enum)
    public DateTime CreatedAt { get; set; }        // Timestamp
    public int FacilityId { get; set; }            // Foreign Key → Facility
    public Facility Facility { get; set; }        // Navigation property
    public ICollection<NotificationSubscription> NotificationSubscriptions { get; set; }  // Many-to-many with Users
}

public enum NotificationPriority
{
    General,    // General information
    Incident,   // Incident report
    High,       // High priority
    Medium,     // Medium priority
    Low         // Low priority
}
```

**Relationships:**
- **Many:1** ← Facility (generated by facility)
- **Many:Many** ↔ Users via NotificationSubscriptions (delivered to staff)

---

## 🔗 Junction Tables (Many-to-Many)

### UserResident (Care Assignments)
**File:** `Models/UserResident.cs` | **Table:** `UserResidents`

```csharp
public class UserResident
{
    public int UserId { get; set; }                // Composite Primary Key + Foreign Key
    public User User { get; set; }                 // Navigation property
    public int ResidentId { get; set; }            // Composite Primary Key + Foreign Key
    public Resident Resident { get; set; }        // Navigation property
}
```

### NotificationSubscription (Alert Subscriptions)
**File:** `Models/NotificationSubscription.cs` | **Table:** `NotificationSubscriptions`

```csharp
public class NotificationSubscription
{
    public int Id { get; set; }                    // Primary Key
    public int UserId { get; set; }                // Foreign Key → User
    public User User { get; set; }                 // Navigation property
    public int NotificationId { get; set; }        // Foreign Key → Notification
    public Notification Notification { get; set; } // Navigation property
}
```

---

## 🏢 Optional Entity: Agency

**File:** `Models/Agency.cs` | **Table:** `Agencies`

```csharp
public class Agency
{
    public int Id { get; set; }                    // Primary Key
    public string Name { get; set; }               // Agency name
    public string Address { get; set; }            // Street address
    public string City { get; set; }               // City
    public string State { get; set; }              // State/Province
    public string Zip { get; set; }                // Postal code
    public ICollection<User> Users { get; set; }   // Navigation property
}
```

**Relationships:**
- **1:Many** → Users (employs healthcare staff)

---

## 🗄️ Entity Framework Configuration

**File:** `AppDbContext.cs`

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Facility> Facilities { get; set; }
    public DbSet<Resident> Residents { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Agency> Agencies { get; set; }
    public DbSet<UserResident> UserResidents { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NotificationSubscription> NotificationSubscriptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure composite primary key for UserResident
        modelBuilder.Entity<UserResident>()
            .HasKey(ur => new { ur.UserId, ur.ResidentId });
    }
}
```

## Entity Descriptions

### Core Entities (Facility-Centric View)

- **🏥 Facility**: **PRIMARY ENTITY** - Care facilities that house residents and employ staff
- **👥 Resident**: Individuals receiving care who live at the facility
- **�‍⚕️ User/Staff**: Healthcare professionals and staff who work at the facility
- **� Notification**: Messages/alerts created for residents and sent to staff
- **🏢 Agency**: Optional external entity that may employ some users

### Relationship Entities

- **UserResident**: Many-to-many junction table linking users to the residents they care for
- **Notification**: Messages/alerts generated for specific facilities
- **NotificationSubscription**: Links users to notifications they want to receive

### Key Relationships (Facility-Focused)

1. **🏥 Facility → 👥 Resident**: **PRIMARY** - Facility houses and manages residents
2. **🏥 Facility → �‍⚕️ User/Staff**: **PRIMARY** - Facility employs staff and healthcare professionals
3. **👥 Resident → � Notification**: Notifications are created **FOR** residents (health updates, incidents, etc.)
4. **� Notification → �👨‍⚕️ User/Staff**: Notifications are **SENT TO** staff who need to respond
5. **👨‍⚕️ User/Staff ↔ � Resident**: Staff provide direct care to residents at the facility
6. **🏢 Agency → 👨‍⚕️ User**: *Optional* - Some staff may be employed by external agencies

### Enums

- **NotificationPriority**: General, Incident, High, Medium, Low