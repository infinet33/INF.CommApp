using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Identity;

namespace INF.CommApp.API.Services
{
    public interface IRoleSeederService
    {
        public Task SeedRolesAsync();
    }

    public class RoleSeederService : IRoleSeederService
    {
        private readonly AppDbContext _context;
        private readonly RoleManager<Role> _roleManager;
        private readonly ILogger<RoleSeederService> _logger;

        public RoleSeederService(
            AppDbContext context,
            RoleManager<Role> roleManager,
            ILogger<RoleSeederService> logger)
        {
            _context = context;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task SeedRolesAsync()
        {
            try
            {
                // Ensure database is created
                await _context.Database.EnsureCreatedAsync();

                var rolesToSeed = new[]
                {
                    new { Name = SystemRoles.Administrator, Description = "System-wide administrator with full access across all facilities" },
                    new { Name = SystemRoles.FacilityAdmin, Description = "Facility administrator with full facility management permissions" },
                    new { Name = SystemRoles.FacilityManager, Description = "Facility operations manager with staff and scheduling permissions" },
                    new { Name = SystemRoles.BillingAdmin, Description = "Facility billing and accounting administrator" },
                    new { Name = SystemRoles.Nurse, Description = "Registered nurse" },
                    new { Name = SystemRoles.LPN, Description = "Licensed practical nurse" },
                    new { Name = SystemRoles.CNA, Description = "Certified nursing assistant" },
                    new { Name = SystemRoles.Doctor, Description = "Medical doctor" },
                    new { Name = SystemRoles.NursePractitioner, Description = "Nurse practitioner" },
                    new { Name = SystemRoles.PhysicianAssistant, Description = "Physician assistant" },
                    new { Name = SystemRoles.Caregiver, Description = "Family member or caregiver" },
                    new { Name = SystemRoles.SocialWorker, Description = "Social worker" },
                    new { Name = SystemRoles.Pharmacist, Description = "Pharmacist" },
                    new { Name = SystemRoles.PhysicalTherapist, Description = "Physical therapist" },
                    new { Name = SystemRoles.OccupationalTherapist, Description = "Occupational therapist" },
                    new { Name = SystemRoles.Resident, Description = "Assisted living resident" },
                    new { Name = SystemRoles.FamilyMember, Description = "Family member of resident" },
                    new { Name = SystemRoles.ReadOnly, Description = "Read-only access (reporting, etc.)" }
                };

                foreach (var roleInfo in rolesToSeed)
                {
                    Role? existingRole = await _roleManager.FindByNameAsync(roleInfo.Name);
                    if (existingRole == null)
                    {
                        Role role = new Role
                        {
                            Name = roleInfo.Name,
                            NormalizedName = roleInfo.Name.ToUpper(),
                            Description = roleInfo.Description
                        };

                        Microsoft.AspNetCore.Identity.IdentityResult result = await _roleManager.CreateAsync(role);
                        if (result.Succeeded)
                        {
                            _logger.LogInformation("Created role: {RoleName}", roleInfo.Name);
                        }
                        else
                        {
                            _logger.LogError("Failed to create role {RoleName}: {Errors}",
                                roleInfo.Name, string.Join(", ", result.Errors.Select(e => e.Description)));
                        }
                    }
                }

                _logger.LogInformation("Role seeding completed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while seeding roles");
                throw;
            }
        }
    }
}