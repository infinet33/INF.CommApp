using INF.CommApp.BLL.Interfaces;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.BLL.Services
{
    public class AgencyService : IAgencyService
    {
        private readonly AppDbContext _context;

        public AgencyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Agency> CreateAgencyAsync(string name, string address, string city, string state, string zip)
        {
            Agency agency = new Agency
            {
                Name = name,
                Address = address,
                City = city,
                State = state,
                Zip = zip
            };

            _context.Agencies.Add(agency);
            await _context.SaveChangesAsync();
            return agency;
        }

        public async Task<Agency?> GetAgencyByExternalIdAsync(Guid externalId)
        {
            return await _context.Agencies
                .Include(x => x.Users)
                .FirstOrDefaultAsync(x => x.ExternalId == externalId);
        }

        public async Task<Agency> UpdateAgencyAsync(Guid externalId, string name, string address, string city, string state, string zip)
        {
            Agency? agency = await _context.Agencies.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (agency == null)
            {
                throw new ArgumentException($"Agency with external ID {externalId} not found");
            }

            agency.Name = name;
            agency.Address = address;
            agency.City = city;
            agency.State = state;
            agency.Zip = zip;

            await _context.SaveChangesAsync();
            return agency;
        }

        public async Task<bool> DeleteAgencyAsync(Guid externalId)
        {
            Agency? agency = await _context.Agencies.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (agency == null)
            {
                return false;
            }

            _context.Agencies.Remove(agency);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Agency>> GetAllAgenciesAsync()
        {
            return await _context.Agencies
                .Include(x => x.Users)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetAgencyUsersAsync(Guid agencyExternalId)
        {
            Agency? agency = await _context.Agencies.FirstOrDefaultAsync(x => x.ExternalId == agencyExternalId);
            if (agency == null)
            {
                throw new ArgumentException($"Agency with external ID {agencyExternalId} not found");
            }

            return await _context.Users
                .Where(x => x.AgencyId == agency.Id)
                .Include(x => x.UserResidents)
                .Include(x => x.NotificationSubscriptions)
                .ToListAsync();
        }
    }
}