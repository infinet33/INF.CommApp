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
    }
}