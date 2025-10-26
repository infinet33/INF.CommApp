# INF.CommApp.DATA - Detailed Entity Specifications

**Complete technical specifications of all data entities with C# implementations.**

## 🎯 Purpose
This document provides **detailed technical specifications** of each entity, including actual C# code, properties, relationships, and database mappings.

## 🗃️ Database Tables Overview

| Table | Type | Purpose | Key Relationships | External ID |
|-------|------|---------|-------------------|-------------|
| `Facilities` | Core | Care facilities (PRIMARY) | → Residents, Notifications | ✅ UUID |
| `Residents` | Core | Patients/clients | ← Facility, ↔ Users | ✅ UUID |
| `Users` | Core | Healthcare staff **[AUTH-ENABLED]** | ↔ Residents, Notifications, Roles | ✅ UUID |
| `Roles` | Auth | Role-based access control **[NEW v2.0]** | ↔ Users | ✅ UUID |
| `UserRoles` | Auth Junction | User-Role assignments **[NEW v2.0]** | User ↔ Role | ❌ N/A |
| `UserNotificationPreferences` | Core | User notification settings **[NEW v2.0]** | ← User | ✅ UUID |
| `Notifications` | Core | Alerts/messages | ← Facility, ↔ Users | ✅ UUID |
| `UserResidents` | Junction | Care assignments | User ↔ Resident | ❌ N/A |
| `NotificationSubscriptions` | Junction | Alert subscriptions | User ↔ Notification | ❌ N/A |
| `Agencies` | Optional | Healthcare agencies | → Users | ✅ UUID |

## 📅 Last Updated
- **Date**: October 25, 2025
- **Version**: 2.0 (Authentication System Integration)
- **Migration**: `AddAuthenticationTables` (20251026023014)
- **Auto-sync required:** Update this document when modifying any `INF.CommApp.DATA.Models` classes.

## 🔑 External ID Pattern

All main entities implement an **External ID pattern** for API operations:

### Purpose
- **Internal ID (`Id`)**: Integer primary key used for database relationships and internal operations
- **External ID (`ExternalId`)**: GUID used for all external API calls and client-facing operations

### Benefits
1. **Security**: Prevents enumeration attacks (clients can't guess IDs)
2. **Flexibility**: Internal IDs can change without affecting external clients
3. **Integration**: Standard UUID format for external systems
4. **Privacy**: Obscures internal database structure and record counts

### Implementation
```csharp
public Guid ExternalId { get; set; } = Guid.NewGuid();
```

### Usage Pattern
- **API Controllers**: Always use `ExternalId` in endpoints (e.g., `/api/facilities/{externalId}`)
- **Services**: Convert between `ExternalId` and `Id` at the service layer boundary
- **Database**: Both IDs are persisted, `Id` for relationships, `ExternalId` for external access

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
    public Guid ExternalId { get; set; } = Guid.NewGuid();  // External API identifier (UUID)
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
    public Guid ExternalId { get; set; } = Guid.NewGuid();  // External API identifier (UUID)
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
    public Guid ExternalId { get; set; } = Guid.NewGuid();  // External API identifier (UUID)
    public string UserName { get; set; }           // Username/login
    public string Type { get; set; }               // Role: nurse, caregiver, doctor, etc.
    public int? AgencyId { get; set; }             // Foreign Key → Agency (nullable)
    public Agency Agency { get; set; }             // Navigation property
    public ICollection<UserResident> UserResidents { get; set; }           // Many-to-many with Residents
    public ICollection<NotificationSubscription> NotificationSubscriptions { get; set; }  // Many-to-many with Notifications
}
```

**Authentication Fields** (Added in v2.0):
```csharp
// Authentication & Security (ASP.NET Core Identity integration)
public string EmailAddress { get; set; }          // Primary authentication identifier (indexed, unique)
public string PasswordHash { get; set; }          // Securely hashed password
public string? SecurityStamp { get; set; }        // Security token for session invalidation
public bool EmailConfirmed { get; set; }          // Email verification status
public bool PhoneNumberConfirmed { get; set; }    // Phone verification status
public bool TwoFactorEnabled { get; set; }        // Multi-factor authentication status
public bool LockoutEnabled { get; set; }          // Account lockout capability
public DateTime? LockoutEndUtc { get; set; }      // Lockout expiration time
public int AccessFailedCount { get; set; }        // Failed login attempt counter
public DateTime? LastLoginTimeUtc { get; set; }   // Last successful login timestamp
public DateTime CreatedOnUtc { get; set; }        // Account creation timestamp

// Personal Information
public string FirstName { get; set; }             // User's first name
public string LastName { get; set; }              // User's last name
public string? MobileNumber { get; set; }         // Contact phone number

// Navigation Properties
public ICollection<UserRole> UserRoles { get; set; }  // User's assigned roles
public ICollection<UserNotificationPreference> NotificationPreferences { get; set; }  // Notification settings
```

**Relationships:**
- **Many:1** ← Agency (optionally employed by agency)
- **Many:Many** ↔ Residents via UserResidents (provides care)
- **Many:Many** ↔ Notifications via NotificationSubscriptions (receives alerts)
- **Many:Many** ↔ Roles via UserRoles (role-based access control) **[NEW v2.0]**
- **1:Many** → UserNotificationPreferences (notification settings) **[NEW v2.0]**

---

## 🔐 Authentication Entity: Role **[NEW v2.0]**

**File:** `Models/Role.cs` | **Table:** `Roles`

```csharp
public class Role
{
    public int Id { get; set; }                    // Primary Key
    public Guid ExternalId { get; set; } = Guid.NewGuid();  // External API identifier (UUID)
    public string Name { get; set; }               // Role name (e.g., "Nurse", "Doctor", "Administrator")
    public string NormalizedName { get; set; }     // Uppercase role name for lookups (indexed, unique)
    public string? Description { get; set; }       // Role description and permissions
    public string? ConcurrencyStamp { get; set; }  // Optimistic concurrency control
    public DateTime CreatedOnUtc { get; set; }     // Role creation timestamp
    public ICollection<UserRole> UserRoles { get; set; }  // Users assigned to this role
}
```

**Predefined Healthcare Roles:**
- `Administrator`: Full system access
- `FacilityAdmin`: Facility-level administration
- `Doctor`: Medical professional access
- `Nurse`: Nursing professional access
- `LPN`: Licensed Practical Nurse access
- `CNA`: Certified Nursing Assistant access
- `NursePractitioner`: Advanced practice nurse access
- `PhysicianAssistant`: PA professional access
- `Caregiver`: Family member/caregiver access
- `SocialWorker`: Social services access
- `Pharmacist`: Pharmacy services access
- `PhysicalTherapist`: PT services access
- `OccupationalTherapist`: OT services access
- `ReadOnly`: View-only access

**Relationships:**
- **Many:Many** ↔ Users via UserRoles (users assigned to roles)

---

## 🔗 Authentication Junction: UserRole **[NEW v2.0]**

**File:** `Models/UserRole.cs` | **Table:** `UserRoles`

```csharp
public class UserRole
{
    public int UserId { get; set; }                // Composite Primary Key + Foreign Key
    public User User { get; set; }                 // Navigation property
    public int RoleId { get; set; }                // Composite Primary Key + Foreign Key
    public Role Role { get; set; }                 // Navigation property
    public DateTime AssignedOnUtc { get; set; }    // Role assignment timestamp
    public int? AssignedByUserId { get; set; }     // User who assigned the role (audit trail)
}
```

**Relationships:**
- **Many:1** ← User (user assigned the role)
- **Many:1** ← Role (role assigned to user)

---

## 📧 Core Entity: UserNotificationPreference **[NEW v2.0]**

**File:** `Models/UserNotificationPreference.cs` | **Table:** `UserNotificationPreferences`

```csharp
public class UserNotificationPreference
{
    public int Id { get; set; }                    // Primary Key
    public Guid ExternalId { get; set; } = Guid.NewGuid();  // External API identifier (UUID)
    public int UserId { get; set; }                // Foreign Key → User
    public User User { get; set; }                 // Navigation property
    public string NotificationType { get; set; }   // Type of notification
    public bool IsEnabled { get; set; }            // Preference enabled status
    public string? Settings { get; set; }          // JSON settings for notification preferences
    public DateTime CreatedOnUtc { get; set; }     // Creation timestamp
    public DateTime UpdatedOnUtc { get; set; }     // Last update timestamp
}
```

**Unique Constraints:**
- `IX_UserNotificationPreferences_UserId_NotificationType`: One preference per user per notification type

**Relationships:**
- **Many:1** ← User (user who owns these preferences)

---

## 📢 Core Entity: Notification

**File:** `Models/Notification.cs` | **Table:** `Notifications`

```csharp
public class Notification
{
    public int Id { get; set; }                    // Primary Key
    public Guid ExternalId { get; set; } = Guid.NewGuid();  // External API identifier (UUID)
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
    public Guid ExternalId { get; set; } = Guid.NewGuid();  // External API identifier (UUID)
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
    public DbSet<Role> Roles { get; set; }                    // NEW v2.0
    public DbSet<UserRole> UserRoles { get; set; }            // NEW v2.0
    public DbSet<Agency> Agencies { get; set; }
    public DbSet<UserResident> UserResidents { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NotificationSubscription> NotificationSubscriptions { get; set; }
    public DbSet<UserNotificationPreference> UserNotificationPreferences { get; set; }  // NEW v2.0

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure composite primary key for UserResident
        modelBuilder.Entity<UserResident>()
            .HasKey(ur => new { ur.UserId, ur.ResidentId });

        // Configure composite primary key for UserRole (NEW v2.0)
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        // Configure UserRole relationships (NEW v2.0)
        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure User authentication indexes (NEW v2.0)
        modelBuilder.Entity<User>()
            .HasIndex(u => u.EmailAddress)
            .IsUnique()
            .HasDatabaseName("IX_Users_EmailAddress");

        modelBuilder.Entity<User>()
            .HasIndex(u => u.UserName)
            .HasDatabaseName("IX_Users_UserName");

        // Configure Role indexes (NEW v2.0)
        modelBuilder.Entity<Role>()
            .HasIndex(r => r.NormalizedName)
            .IsUnique()
            .HasDatabaseName("IX_Roles_NormalizedName");

        // Configure UserNotificationPreference unique constraint (NEW v2.0)
        modelBuilder.Entity<UserNotificationPreference>()
            .HasIndex(unp => new { unp.UserId, unp.NotificationType })
            .IsUnique()
            .HasDatabaseName("IX_UserNotificationPreferences_UserId_NotificationType");

        // Configure UserNotificationPreference relationship (NEW v2.0)
        modelBuilder.Entity<UserNotificationPreference>()
            .HasOne(unp => unp.User)
            .WithMany(u => u.NotificationPreferences)
            .HasForeignKey(unp => unp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure External ID indexes for all main entities
        modelBuilder.Entity<User>()
            .HasIndex(u => u.ExternalId)
            .IsUnique()
            .HasDatabaseName("IX_Users_ExternalId");

        modelBuilder.Entity<Role>()
            .HasIndex(r => r.ExternalId)
            .IsUnique()
            .HasDatabaseName("IX_Roles_ExternalId");

        modelBuilder.Entity<Facility>()
            .HasIndex(f => f.ExternalId)
            .IsUnique()
            .HasDatabaseName("IX_Facilities_ExternalId");

        modelBuilder.Entity<Resident>()
            .HasIndex(r => r.ExternalId)
            .IsUnique()
            .HasDatabaseName("IX_Residents_ExternalId");

        modelBuilder.Entity<Agency>()
            .HasIndex(a => a.ExternalId)
            .IsUnique()
            .HasDatabaseName("IX_Agencies_ExternalId");

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.ExternalId)
            .IsUnique()
            .HasDatabaseName("IX_Notifications_ExternalId");

        modelBuilder.Entity<UserNotificationPreference>()
            .HasIndex(unp => unp.ExternalId)
            .IsUnique()
            .HasDatabaseName("IX_UserNotificationPreferences_ExternalId");
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

---

## 🗄️ Database Migration History

### Version 2.0 - Authentication System (October 25, 2025)
**Migration**: `AddAuthenticationTables` (20251026023014)
**Status**: ✅ Applied to LocalDB

**New Tables:**
- `Roles`: Role definitions with healthcare-specific roles
- `UserRoles`: User-Role assignment junction table with audit trail
- `UserNotificationPreferences`: User notification settings and preferences

**Enhanced Tables:**
- `Users`: Added authentication fields (EmailAddress, PasswordHash, SecurityStamp, etc.)

**New Indexes:**
- `IX_Users_EmailAddress` (unique): Authentication lookup
- `IX_Users_UserName`: Authentication support
- `IX_Roles_NormalizedName` (unique): Role lookup
- `IX_UserNotificationPreferences_UserId_NotificationType` (unique): One preference per type

### Previous Versions
- **v1.1**: Added ExternalId fields to all entities (20251025230608)
- **v1.0**: Initial database schema with core entities (20251013013322)

---

## 🔐 Authentication System Integration

### JWT Authentication
- **Token Expiration**: 8 hours
- **Claims**: User ID, email, name, roles, facility/agency associations
- **Security**: Secure signing key, proper validation

### Role-Based Authorization
- **14 Healthcare Roles**: From Administrator to ReadOnly access
- **Automatic Seeding**: Roles created on application startup
- **Audit Trail**: Role assignments tracked with timestamps

### Security Features
- **Password Requirements**: 12+ characters, complexity required
- **Account Lockout**: 5 failed attempts = 30 minute lockout
- **External IDs**: GUID-based public identifiers for API security
- **Email Confirmation**: Configurable for production environments

### API Integration
- **Authentication Endpoints**: Login, register, profile, password change, logout
- **Protected Controllers**: Ready for `[Authorize]` attributes
- **Claims-Based**: User information available via JWT claims