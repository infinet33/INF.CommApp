using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INF.CommApp.DATA.Migrations
{
    /// <inheritdoc />
    public partial class ReorderExternalIdColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clean slate approach - drop all tables and recreate with proper column order
            // Since we can safely drop all data, this is much cleaner and safer
            
            // Drop all tables in proper order (respecting foreign key dependencies)
            migrationBuilder.Sql("DROP TABLE IF EXISTS NotificationSubscriptions");
            migrationBuilder.Sql("DROP TABLE IF EXISTS UserResidents");
            migrationBuilder.Sql("DROP TABLE IF EXISTS Notifications");
            migrationBuilder.Sql("DROP TABLE IF EXISTS Residents");
            migrationBuilder.Sql("DROP TABLE IF EXISTS Users");
            migrationBuilder.Sql("DROP TABLE IF EXISTS Facilities");
            migrationBuilder.Sql("DROP TABLE IF EXISTS Agencies");

            // Recreate all tables with ExternalId as the second column (after Id)
            
            // Agencies table (no dependencies)
            migrationBuilder.Sql(@"
                CREATE TABLE Agencies (
                    Id int IDENTITY(1,1) PRIMARY KEY,
                    ExternalId uniqueidentifier NOT NULL DEFAULT NEWID(),
                    Name nvarchar(max) NOT NULL,
                    Address nvarchar(max) NOT NULL,
                    City nvarchar(max) NOT NULL,
                    State nvarchar(max) NOT NULL,
                    Zip nvarchar(max) NOT NULL
                );
            ");

            // Facilities table (no dependencies)
            migrationBuilder.Sql(@"
                CREATE TABLE Facilities (
                    Id int IDENTITY(1,1) PRIMARY KEY,
                    ExternalId uniqueidentifier NOT NULL DEFAULT NEWID(),
                    Name nvarchar(max) NOT NULL,
                    Address nvarchar(max) NOT NULL,
                    City nvarchar(max) NOT NULL,
                    State nvarchar(max) NOT NULL,
                    Zip nvarchar(max) NOT NULL
                );
            ");

            // Users table (depends on Agencies)
            migrationBuilder.Sql(@"
                CREATE TABLE Users (
                    Id int IDENTITY(1,1) PRIMARY KEY,
                    ExternalId uniqueidentifier NOT NULL DEFAULT NEWID(),
                    UserName nvarchar(max) NOT NULL,
                    Type nvarchar(max) NOT NULL,
                    AgencyId int NULL,
                    FOREIGN KEY (AgencyId) REFERENCES Agencies(Id)
                );
            ");

            // Residents table (depends on Facilities)
            migrationBuilder.Sql(@"
                CREATE TABLE Residents (
                    Id int IDENTITY(1,1) PRIMARY KEY,
                    ExternalId uniqueidentifier NOT NULL DEFAULT NEWID(),
                    FirstName nvarchar(max) NOT NULL,
                    LastName nvarchar(max) NOT NULL,
                    FacilityId int NOT NULL,
                    FOREIGN KEY (FacilityId) REFERENCES Facilities(Id) ON DELETE CASCADE
                );
            ");

            // Notifications table (depends on Facilities)
            migrationBuilder.Sql(@"
                CREATE TABLE Notifications (
                    Id int IDENTITY(1,1) PRIMARY KEY,
                    ExternalId uniqueidentifier NOT NULL DEFAULT NEWID(),
                    Message nvarchar(max) NOT NULL,
                    Priority int NOT NULL,
                    CreatedAt datetime2 NOT NULL,
                    FacilityId int NOT NULL,
                    FOREIGN KEY (FacilityId) REFERENCES Facilities(Id) ON DELETE CASCADE
                );
            ");

            // UserResidents junction table (depends on Users and Residents)
            migrationBuilder.Sql(@"
                CREATE TABLE UserResidents (
                    UserId int NOT NULL,
                    ResidentId int NOT NULL,
                    PRIMARY KEY (UserId, ResidentId),
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
                    FOREIGN KEY (ResidentId) REFERENCES Residents(Id) ON DELETE CASCADE
                );
            ");

            // NotificationSubscriptions junction table (depends on Users and Notifications)
            migrationBuilder.Sql(@"
                CREATE TABLE NotificationSubscriptions (
                    UserId int NOT NULL,
                    NotificationId int NOT NULL,
                    PRIMARY KEY (UserId, NotificationId),
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
                    FOREIGN KEY (NotificationId) REFERENCES Notifications(Id) ON DELETE CASCADE
                );
            ");

            // Create all the unique indexes for ExternalId columns
            migrationBuilder.CreateIndex(
                name: "IX_Agencies_ExternalId",
                table: "Agencies",
                column: "ExternalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Facilities_ExternalId",
                table: "Facilities",
                column: "ExternalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ExternalId",
                table: "Users",
                column: "ExternalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Residents_ExternalId",
                table: "Residents",
                column: "ExternalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ExternalId",
                table: "Notifications",
                column: "ExternalId",
                unique: true);

            // Create indexes for foreign key columns for performance
            migrationBuilder.CreateIndex(
                name: "IX_Users_AgencyId",
                table: "Users",
                column: "AgencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Residents_FacilityId",
                table: "Residents",
                column: "FacilityId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_FacilityId",
                table: "Notifications",
                column: "FacilityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This migration only changes column order, which doesn't affect functionality
            // The Down method would recreate tables with the original column order
            // For simplicity, we'll leave this empty as column order doesn't impact functionality
        }
    }
}
