using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INF.CommApp.DATA.Migrations
{
    /// <inheritdoc />
    public partial class AddExternalIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ExternalId",
                table: "Users",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            migrationBuilder.AddColumn<Guid>(
                name: "ExternalId",
                table: "Residents",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            migrationBuilder.AddColumn<Guid>(
                name: "ExternalId",
                table: "Notifications",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Facilities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ExternalId",
                table: "Facilities",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Facilities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Facilities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Agencies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Agencies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ExternalId",
                table: "Agencies",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Agencies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Agencies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.CreateIndex(
                name: "IX_Facilities_ExternalId",
                table: "Facilities",
                column: "ExternalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Agencies_ExternalId",
                table: "Agencies",
                column: "ExternalId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_ExternalId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Residents_ExternalId",
                table: "Residents");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ExternalId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Facilities_ExternalId",
                table: "Facilities");

            migrationBuilder.DropIndex(
                name: "IX_Agencies_ExternalId",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Residents");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Agencies");
        }
    }
}
