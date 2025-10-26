# Database Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying and updating the INF.CommApp database across different environments.

## Prerequisites
- .NET 9.0 SDK
- Entity Framework Core CLI tools: `dotnet tool install --global dotnet-ef`
- SQL Server (LocalDB for development, Azure SQL for production)
- Visual Studio or VS Code with appropriate extensions

## Environment Configuration

### Development Environment
**Database**: SQL Server LocalDB
**Connection String**: `Server=(localdb)\\MSSQLLocalDB;Database=INF.CommApp.Dev;Trusted_Connection=true`
**Configuration File**: `appsettings.Development.json`

### Production Environment  
**Database**: Azure SQL Database
**Connection String**: Retrieved from Azure Key Vault
**Authentication**: Azure AD with managed identity

## Current Database State

### Latest Migration
- **Name**: `AddAuthenticationTables`
- **Timestamp**: `20251026023014`
- **Description**: Adds authentication system with roles, user security fields, and notification preferences

### Applied Migrations History
1. `InitialScript` (20251013013322) - Initial database schema
2. `AddExternalIds` (20251025230608) - Added ExternalId GUID fields
3. `ReorderExternalIdColumns` (20251025232900) - Optimized column ordering
4. `AddAuthenticationTables` (20251026023014) - Authentication system implementation

## Deployment Commands

### For Development (LocalDB)
```powershell
# Navigate to DATA project
cd "c:\Users\jeato\OneDrive\Source\INF.CommApp\INF.CommApp.DATA"

# Apply all pending migrations
dotnet ef database update --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"

# Create new migration (if needed)
dotnet ef migrations add "MigrationName" --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"
```

### For Production (Azure SQL)
```powershell
# Set production environment
$env:ASPNETCORE_ENVIRONMENT="Production"

# Navigate to DATA project
cd "path\to\INF.CommApp.DATA"

# Apply migrations to production
dotnet ef database update --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"
```

### Generate SQL Scripts (for manual deployment)
```powershell
# Generate script for all migrations
dotnet ef migrations script --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj" --output database-update.sql

# Generate script from specific migration
dotnet ef migrations script AddExternalIds AddAuthenticationTables --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj" --output auth-update.sql
```

## Database Initialization

### First-Time Setup
1. **Create Local Database**:
   ```powershell
   dotnet ef database update --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"
   ```

2. **Verify Tables Created**:
   - Users (with authentication fields)
   - Roles
   - UserRoles
   - Facilities
   - Agencies
   - Residents
   - UserResidents
   - Notifications
   - NotificationSubscriptions
   - UserNotificationPreferences

3. **System Roles Seeding**:
   The system automatically seeds predefined roles on application startup:
   - Administrator
   - FacilityAdmin
   - Doctor, Nurse, LPN, CNA
   - NursePractitioner, PhysicianAssistant
   - Caregiver, SocialWorker
   - Pharmacist, PhysicalTherapist, OccupationalTherapist
   - ReadOnly

## Troubleshooting

### Common Issues

#### 1. Azure AD Authentication Errors
**Error**: `Failed to authenticate the user admin@infinetsolutions.net in Active Directory`
**Solution**: 
- Use LocalDB for development
- Update `AppDbContextFactory.cs` to read from configuration
- Ensure MFA is configured for Azure AD accounts

#### 2. Connection String Not Found
**Error**: `DbContext named 'AppDbContext' was not found`
**Solution**:
- Verify `AppDbContextFactory` is properly configured
- Check `appsettings.Development.json` has correct connection string
- Ensure startup project path is correct

#### 3. Migration Conflicts
**Error**: `An operation was scaffolded that may result in the loss of data`
**Solution**:
- Review migration file before applying
- Backup data if necessary
- Use `dotnet ef migrations remove` to undo last migration if needed

### Rollback Procedures

#### Rollback to Previous Migration
```powershell
# Rollback to specific migration
dotnet ef database update PreviousMigrationName --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"

# Rollback to initial state
dotnet ef database update 0 --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"
```

#### Remove Last Migration (before applying)
```powershell
dotnet ef migrations remove --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"
```

## Data Seeding

### Role Seeding
Roles are automatically seeded on application startup via `RoleSeederService`. No manual intervention required.

### Test Data Creation
For development and testing, consider creating a data seeding service for:
- Sample facilities
- Test users with various roles  
- Sample residents and relationships
- Notification preferences

## Security Considerations

### Database Access
- **Development**: Windows Authentication with LocalDB
- **Production**: Azure AD authentication with managed identity
- **Connection Strings**: Stored in Azure Key Vault for production

### Migration Security
- Review all migrations before applying to production
- Test migrations in staging environment first
- Backup production database before major schema changes
- Monitor for data loss warnings in migration output

## Monitoring and Maintenance

### Database Health Checks
- Monitor database size and performance
- Regular index maintenance
- Query performance analysis
- Connection pool monitoring

### Migration Audit
- Keep record of all applied migrations
- Document rollback procedures for each major release
- Test migration rollback procedures in staging

## Environment-Specific Notes

### Development
- Uses LocalDB for ease of development  
- Database automatically created on first migration
- No additional setup required after LocalDB installation

### Staging
- Should mirror production configuration
- Use for testing migrations before production deployment
- Consider using Azure SQL Database (smaller tier)

### Production
- Azure SQL Database with appropriate service tier
- Automated backups configured
- High availability and disaster recovery enabled
- Monitoring and alerting configured

## Quick Reference Commands

```powershell
# Check migration status
dotnet ef migrations list --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"

# Check database status  
dotnet ef database update --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj" --verbose

# Generate migration script
dotnet ef migrations script --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"

# Drop database (development only)
dotnet ef database drop --startup-project "../INF.CommApp.Api/INF.CommApp.API.csproj"
```

---
**Last Updated**: October 25, 2025  
**Version**: 2.0 (Authentication System Integration)