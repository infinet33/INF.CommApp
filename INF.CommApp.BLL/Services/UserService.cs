using INF.CommApp.BLL.Interfaces;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.BLL.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateUserAsync(string userName, string type, Guid? agencyExtId)
        {
            int? agencyId = null;
            if (agencyExtId.HasValue)
            {
                Agency? agency = await _context.Agencies.FirstOrDefaultAsync(x => x.ExternalId == agencyExtId.Value);
                if (agency == null)
                {
                    throw new ArgumentException($"Agency with external ID {agencyExtId} not found");
                }
                agencyId = agency.Id;
            }

            User user = new User
            {
                UserName = userName,
                Type = type,
                AgencyId = agencyId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetUserByExternalIdAsync(Guid externalId)
        {
            return await _context.Users
                .Include(x => x.UserResidents)
                .Include(x => x.NotificationSubscriptions)
                .FirstOrDefaultAsync(x => x.ExternalId == externalId);
        }

        public async Task<User> UpdateUserAsync(Guid externalId, string? userName, string? type)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (user == null)
            {
                throw new ArgumentException($"User with external ID {externalId} not found");
            }

            user.UserName = userName ?? user.UserName;
            user.Type = type ?? user.Type;

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(Guid externalId)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.ExternalId == externalId);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(x => x.UserResidents)
                .Include(x => x.NotificationSubscriptions)
                .ToListAsync();
        }

        public async Task<IEnumerable<Resident>> GetUserResidentsAsync(Guid userExternalId)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.ExternalId == userExternalId);
            if (user == null)
            {
                throw new ArgumentException($"User with external ID {userExternalId} not found");
            }

            return await _context.UserResidents
                .Where(x => x.UserId == user.Id)
                .Select(x => x.Resident)
                .ToListAsync();
        }

        public async Task<bool> RequestAccessToResidentAsync(Guid userExternalId, Guid residentExternalId)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(x => x.ExternalId == userExternalId);
            if (user == null)
            {
                throw new ArgumentException($"User with external ID {userExternalId} not found");
            }

            Resident? resident = await _context.Residents.FirstOrDefaultAsync(x => x.ExternalId == residentExternalId);
            if (resident == null)
            {
                throw new ArgumentException($"Resident with external ID {residentExternalId} not found");
            }

            // Check if relationship already exists
            UserResident? existingRelation = await _context.UserResidents
                .FirstOrDefaultAsync(x => x.UserId == user.Id && x.ResidentId == resident.Id);

            if (existingRelation != null)
            {
                return false; // Already exists
            }

            UserResident userResident = new UserResident
            {
                UserId = user.Id,
                ResidentId = resident.Id
            };

            _context.UserResidents.Add(userResident);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}