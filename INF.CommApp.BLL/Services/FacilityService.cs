using INF.CommApp.BLL.Interfaces;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.BLL.Services
{
    public class FacilityService : IFacilityService
    {
        private readonly AppDbContext _context;
        private readonly IUserService _userService;

        public FacilityService(AppDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<Facility> CreateFacilityAsync(string name, string address, string city, string state, string zip)
        {
            Facility facility = new Facility
            {
                Name = name,
                Address = address,
                City = city,
                State = state,
                Zip = zip
            };

            _context.Facilities.Add(facility);
            await _context.SaveChangesAsync();
            return facility;
        }

        public async Task<Facility?> GetFacilityByExternalIdAsync(Guid externalId)
        {
            return await _context.Facilities
                .Include(x => x.Residents)
                .FirstOrDefaultAsync(x => x.ExternalId == externalId);
        }

        public async Task<Facility> UpdateFacilityAsync(Guid externalId, string name, string address, string city, string state, string zip)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (facility == null)
            {
                throw new ArgumentException($"Facility with external ID {externalId} not found");
            }

            facility.Name = name;
            facility.Address = address;
            facility.City = city;
            facility.State = state;
            facility.Zip = zip;

            await _context.SaveChangesAsync();
            return facility;
        }

        public async Task<bool> DeleteFacilityAsync(Guid externalId)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (facility == null)
            {
                return false;
            }

            _context.Facilities.Remove(facility);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Facility>> GetAllFacilitiesAsync()
        {
            return await _context.Facilities
                .Include(x => x.Residents)
                .ToListAsync();
        }

        public async Task<Resident> AddResidentToFacilityAsync(Guid facilityExternalId, string firstName, string lastName)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == facilityExternalId);
            if (facility == null)
            {
                throw new ArgumentException($"Facility with external ID {facilityExternalId} not found");
            }

            Resident resident = new Resident
            {
                FirstName = firstName,
                LastName = lastName,
                FacilityId = facility.Id
            };

            _context.Residents.Add(resident);
            await _context.SaveChangesAsync();
            return resident;
        }

        public async Task<Resident?> GetResidentAsync(Guid facilityExternalId, Guid residentExternalId)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == facilityExternalId);
            if (facility == null)
            {
                return null;
            }

            return await _context.Residents
                .Include(x => x.UserResidents)
                .FirstOrDefaultAsync(x => x.ExternalId == residentExternalId && x.FacilityId == facility.Id);
        }

        public async Task<Resident> UpdateResidentAsync(Guid facilityExternalId, Guid residentExternalId, string firstName, string lastName)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == facilityExternalId);
            if (facility == null)
            {
                throw new ArgumentException($"Facility with external ID {facilityExternalId} not found");
            }

            Resident? resident = await _context.Residents.FirstOrDefaultAsync(x => x.ExternalId == residentExternalId && x.FacilityId == facility.Id);
            if (resident == null)
            {
                throw new ArgumentException($"Resident with external ID {residentExternalId} not found in facility");
            }

            resident.FirstName = firstName;
            resident.LastName = lastName;

            await _context.SaveChangesAsync();
            return resident;
        }

        public async Task<bool> DeleteResidentAsync(Guid facilityExternalId, Guid residentExternalId)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == facilityExternalId);
            if (facility == null)
            {
                return false;
            }

            Resident? resident = await _context.Residents.FirstOrDefaultAsync(x => x.ExternalId == residentExternalId && x.FacilityId == facility.Id);
            if (resident == null)
            {
                return false;
            }

            _context.Residents.Remove(resident);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> AddStaffToFacilityAsync(Guid facilityExternalId, string userName, string type, Guid? agencyExtId)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == facilityExternalId);
            if (facility == null)
            {
                throw new ArgumentException($"Facility with external ID {facilityExternalId} not found");
            }

            // Use the UserService to create the user - maintaining single responsibility
            return await _userService.CreateUserAsync(userName, type, agencyExtId);
        }

        // NEW: Multi-Tenancy Operations

        public async Task<Facility?> GetFacilityByIdAsync(int id)
        {
            return await _context.Facilities
                .Include(x => x.Residents)
                .Include(x => x.UserFacilities)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> AssignUserToFacilityAsync(int userId, int facilityId, string? roleAtFacility = null)
        {
            // Check if assignment already exists
            bool exists = await _context.UserFacilities
                .AnyAsync(uf => uf.UserId == userId && uf.FacilityId == facilityId);

            if (exists)
            {
                return false; // Assignment already exists
            }

            var userFacility = new UserFacility
            {
                UserId = userId,
                FacilityId = facilityId,
                RoleAtFacility = roleAtFacility,
                AssignedOnUtc = DateTime.UtcNow,
                IsActive = true
            };

            _context.UserFacilities.Add(userFacility);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignUserToFacilityAsync(Guid userExternalId, Guid facilityExternalId, string? roleAtFacility = null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ExternalId == userExternalId);
            var facility = await _context.Facilities.FirstOrDefaultAsync(f => f.ExternalId == facilityExternalId);

            if (user == null || facility == null)
            {
                return false;
            }

            return await AssignUserToFacilityAsync(user.Id, facility.Id, roleAtFacility);
        }

        public async Task<bool> RemoveUserFromFacilityAsync(int userId, int facilityId)
        {
            var userFacility = await _context.UserFacilities
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.FacilityId == facilityId);

            if (userFacility == null)
            {
                return false;
            }

            _context.UserFacilities.Remove(userFacility);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveUserFromFacilityAsync(Guid userExternalId, Guid facilityExternalId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ExternalId == userExternalId);
            var facility = await _context.Facilities.FirstOrDefaultAsync(f => f.ExternalId == facilityExternalId);

            if (user == null || facility == null)
            {
                return false;
            }

            return await RemoveUserFromFacilityAsync(user.Id, facility.Id);
        }

        public async Task<bool> UpdateUserFacilityRoleAsync(int userId, int facilityId, string roleAtFacility)
        {
            var userFacility = await _context.UserFacilities
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.FacilityId == facilityId);

            if (userFacility == null)
            {
                return false;
            }

            userFacility.RoleAtFacility = roleAtFacility;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeactivateUserAtFacilityAsync(int userId, int facilityId, DateTime? endDate = null)
        {
            var userFacility = await _context.UserFacilities
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.FacilityId == facilityId);

            if (userFacility == null)
            {
                return false;
            }

            userFacility.IsActive = false;
            userFacility.EndDateUtc = endDate ?? DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Facility>> GetUserFacilitiesAsync(int userId)
        {
            return await _context.UserFacilities
                .Where(uf => uf.UserId == userId && uf.IsActive)
                .Include(uf => uf.Facility)
                .Select(uf => uf.Facility)
                .ToListAsync();
        }

        public async Task<IEnumerable<Facility>> GetUserFacilitiesAsync(Guid userExternalId)
        {
            return await _context.UserFacilities
                .Where(uf => uf.User.ExternalId == userExternalId && uf.IsActive)
                .Include(uf => uf.Facility)
                .Select(uf => uf.Facility)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetFacilityUsersAsync(int facilityId, bool activeOnly = true)
        {
            var query = _context.UserFacilities
                .Where(uf => uf.FacilityId == facilityId);

            if (activeOnly)
            {
                query = query.Where(uf => uf.IsActive);
            }

            return await query
                .Include(uf => uf.User)
                .Select(uf => uf.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetFacilityUsersAsync(Guid facilityExternalId, bool activeOnly = true)
        {
            var query = _context.UserFacilities
                .Where(uf => uf.Facility.ExternalId == facilityExternalId);

            if (activeOnly)
            {
                query = query.Where(uf => uf.IsActive);
            }

            return await query
                .Include(uf => uf.User)
                .Select(uf => uf.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserFacility>> GetUserFacilityAssignmentsAsync(int userId)
        {
            return await _context.UserFacilities
                .Where(uf => uf.UserId == userId)
                .Include(uf => uf.Facility)
                .Include(uf => uf.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserFacility>> GetFacilityUserAssignmentsAsync(int facilityId)
        {
            return await _context.UserFacilities
                .Where(uf => uf.FacilityId == facilityId)
                .Include(uf => uf.Facility)
                .Include(uf => uf.User)
                .ToListAsync();
        }

        public async Task<bool> IsUserAssignedToFacilityAsync(int userId, int facilityId)
        {
            return await _context.UserFacilities
                .AnyAsync(uf => uf.UserId == userId && uf.FacilityId == facilityId && uf.IsActive);
        }

        public async Task<bool> IsUserAssignedToFacilityAsync(Guid userExternalId, Guid facilityExternalId)
        {
            return await _context.UserFacilities
                .AnyAsync(uf => uf.User.ExternalId == userExternalId &&
                               uf.Facility.ExternalId == facilityExternalId &&
                               uf.IsActive);
        }

        public async Task<bool> CanUserAccessFacilityAsync(int userId, int facilityId)
        {
            // Check if user is assigned to facility
            bool isAssigned = await IsUserAssignedToFacilityAsync(userId, facilityId);
            if (isAssigned)
            {
                return true;
            }

            // Check if user has system-wide access (Administrator role)
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user != null)
            {
                var userRoles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
                return userRoles.Contains(SystemRoles.Administrator);
            }

            return false;
        }

        public async Task<string?> GetUserRoleAtFacilityAsync(int userId, int facilityId)
        {
            var userFacility = await _context.UserFacilities
                .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.FacilityId == facilityId && uf.IsActive);

            return userFacility?.RoleAtFacility;
        }

        public async Task<int> AssignMultipleUsersToFacilityAsync(IEnumerable<int> userIds, int facilityId, string? defaultRole = null)
        {
            int assignedCount = 0;

            foreach (int userId in userIds)
            {
                bool success = await AssignUserToFacilityAsync(userId, facilityId, defaultRole);
                if (success)
                {
                    assignedCount++;
                }
            }

            return assignedCount;
        }

        public async Task<int> AssignUserToMultipleFacilitiesAsync(int userId, IEnumerable<int> facilityIds, string? defaultRole = null)
        {
            int assignedCount = 0;

            foreach (int facilityId in facilityIds)
            {
                bool success = await AssignUserToFacilityAsync(userId, facilityId, defaultRole);
                if (success)
                {
                    assignedCount++;
                }
            }

            return assignedCount;
        }
    }
}