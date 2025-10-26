using INF.CommApp.BLL.Interfaces;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.BLL.Services
{
    public class ResidentService : IResidentService
    {
        private readonly AppDbContext _context;

        public ResidentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Resident> CreateResidentAsync(string firstName, string lastName, Guid facilityExternalId)
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

        public async Task<Resident?> GetResidentByExternalIdAsync(Guid externalId)
        {
            return await _context.Residents
                .Include(x => x.UserResidents)
                .Include(x => x.Facility)
                .FirstOrDefaultAsync(x => x.ExternalId == externalId);
        }

        public async Task<Resident> UpdateResidentAsync(Guid externalId, string firstName, string lastName)
        {
            Resident? resident = await _context.Residents.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (resident == null)
            {
                throw new ArgumentException($"Resident with external ID {externalId} not found");
            }

            resident.FirstName = firstName;
            resident.LastName = lastName;

            await _context.SaveChangesAsync();
            return resident;
        }

        public async Task<bool> DeleteResidentAsync(Guid externalId)
        {
            Resident? resident = await _context.Residents.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (resident == null)
            {
                return false;
            }

            _context.Residents.Remove(resident);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Resident>> GetAllResidentsAsync()
        {
            return await _context.Residents
                .Include(x => x.UserResidents)
                .Include(x => x.Facility)
                .ToListAsync();
        }

        public async Task<IEnumerable<Resident>> GetResidentsByFacilityAsync(Guid facilityExternalId)
        {
            Facility? facility = await _context.Facilities.FirstOrDefaultAsync(x => x.ExternalId == facilityExternalId);
            if (facility == null)
            {
                throw new ArgumentException($"Facility with external ID {facilityExternalId} not found");
            }

            return await _context.Residents
                .Where(x => x.FacilityId == facility.Id)
                .Include(x => x.UserResidents)
                .ToListAsync();
        }
    }
}