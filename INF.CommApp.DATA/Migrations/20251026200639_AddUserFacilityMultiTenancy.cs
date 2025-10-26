using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INF.CommApp.DATA.Migrations
{
    /// <inheritdoc />
    public partial class AddUserFacilityMultiTenancy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserFacilities",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FacilityId = table.Column<int>(type: "int", nullable: false),
                    AssignedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RoleAtFacility = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    EndDateUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFacilities", x => new { x.UserId, x.FacilityId });
                    table.ForeignKey(
                        name: "FK_UserFacilities_Facilities_FacilityId",
                        column: x => x.FacilityId,
                        principalTable: "Facilities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFacilities_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserFacilities_FacilityId",
                table: "UserFacilities",
                column: "FacilityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserFacilities");
        }
    }
}
