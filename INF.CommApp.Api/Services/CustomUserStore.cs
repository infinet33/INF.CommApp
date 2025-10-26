using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.API.Services
{
    public class CustomUserStore : IUserStore<User>, IUserPasswordStore<User>,
        IUserEmailStore<User>, IUserSecurityStampStore<User>, IUserLockoutStore<User>,
        IUserTwoFactorStore<User>, IUserPhoneNumberStore<User>, IUserRoleStore<User>
    {
        private readonly AppDbContext _context;

        public CustomUserStore(AppDbContext context)
        {
            _context = context;
        }

        public void Dispose()
        {
            _context?.Dispose();
            GC.SuppressFinalize(this);
        }

        public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<User?> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            if (int.TryParse(userId, out int id))
            {
                return await _context.Users.FindAsync(new object[] { id }, cancellationToken);
            }
            return null;
        }

        public async Task<User?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.UserName.ToUpper() == normalizedUserName, cancellationToken);
        }

        public Task<string?> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult<string?>(user.UserName?.ToUpper());
        }

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id.ToString());
        }

        public Task<string?> GetUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult<string?>(user.UserName);
        }

        public Task SetNormalizedUserNameAsync(User user, string? normalizedName, CancellationToken cancellationToken)
        {
            // We don't store normalized username separately
            return Task.CompletedTask;
        }

        public Task SetUserNameAsync(User user, string? userName, CancellationToken cancellationToken)
        {
            user.UserName = userName ?? string.Empty;
            return Task.CompletedTask;
        }

        public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        // IUserPasswordStore implementation
        public Task<string?> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult<string?>(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
        }

        public Task SetPasswordHashAsync(User user, string? passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash ?? string.Empty;
            return Task.CompletedTask;
        }

        // IUserEmailStore implementation
        public async Task<User?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.EmailAddress.ToUpper() == normalizedEmail, cancellationToken);
        }

        public Task<string?> GetEmailAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult<string?>(user.EmailAddress);
        }

        public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task<string?> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult<string?>(user.EmailAddress?.ToUpper());
        }

        public Task SetEmailAsync(User user, string? email, CancellationToken cancellationToken)
        {
            user.EmailAddress = email ?? string.Empty;
            return Task.CompletedTask;
        }

        public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.CompletedTask;
        }

        public Task SetNormalizedEmailAsync(User user, string? normalizedEmail, CancellationToken cancellationToken)
        {
            // We don't store normalized email separately
            return Task.CompletedTask;
        }

        // IUserSecurityStampStore implementation
        public Task<string?> GetSecurityStampAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.SecurityStamp);
        }

        public Task SetSecurityStampAsync(User user, string stamp, CancellationToken cancellationToken)
        {
            user.SecurityStamp = stamp;
            return Task.CompletedTask;
        }

        // IUserLockoutStore implementation
        public Task<int> GetAccessFailedCountAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task<bool> GetLockoutEnabledAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.LockoutEnabled);
        }

        public Task<DateTimeOffset?> GetLockoutEndDateAsync(User user, CancellationToken cancellationToken)
        {
            DateTimeOffset? result = user.LockoutEndUtc.HasValue ?
                new DateTimeOffset(user.LockoutEndUtc.Value) : null;
            return Task.FromResult(result);
        }

        public Task<int> IncrementAccessFailedCountAsync(User user, CancellationToken cancellationToken)
        {
            user.AccessFailedCount++;
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task ResetAccessFailedCountAsync(User user, CancellationToken cancellationToken)
        {
            user.AccessFailedCount = 0;
            return Task.CompletedTask;
        }

        public Task SetLockoutEnabledAsync(User user, bool enabled, CancellationToken cancellationToken)
        {
            user.LockoutEnabled = enabled;
            return Task.CompletedTask;
        }

        public Task SetLockoutEndDateAsync(User user, DateTimeOffset? lockoutEnd, CancellationToken cancellationToken)
        {
            user.LockoutEndUtc = lockoutEnd?.UtcDateTime;
            return Task.CompletedTask;
        }

        // IUserTwoFactorStore implementation
        public Task<bool> GetTwoFactorEnabledAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.TwoFactorEnabled);
        }

        public Task SetTwoFactorEnabledAsync(User user, bool enabled, CancellationToken cancellationToken)
        {
            user.TwoFactorEnabled = enabled;
            return Task.CompletedTask;
        }

        // IUserPhoneNumberStore implementation
        public Task<string?> GetPhoneNumberAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.MobileNumber);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumberConfirmed);
        }

        public Task SetPhoneNumberAsync(User user, string? phoneNumber, CancellationToken cancellationToken)
        {
            user.MobileNumber = phoneNumber;
            return Task.CompletedTask;
        }

        public Task SetPhoneNumberConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            user.PhoneNumberConfirmed = confirmed;
            return Task.CompletedTask;
        }

        // IUserRoleStore implementation
        public async Task AddToRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            Role? role = await _context.Roles
                .FirstOrDefaultAsync(r => r.NormalizedName == roleName.ToUpper(), cancellationToken);

            if (role == null)
            {
                throw new InvalidOperationException($"Role '{roleName}' not found.");
            }

            UserRole? existingUserRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == user.Id && ur.RoleId == role.Id, cancellationToken);

            if (existingUserRole == null)
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id,
                    AssignedOnUtc = DateTime.UtcNow
                });
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task RemoveFromRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            Role? role = await _context.Roles
                .FirstOrDefaultAsync(r => r.NormalizedName == roleName.ToUpper(), cancellationToken);

            if (role != null)
            {
                UserRole? userRole = await _context.UserRoles
                    .FirstOrDefaultAsync(ur => ur.UserId == user.Id && ur.RoleId == role.Id, cancellationToken);

                if (userRole != null)
                {
                    _context.UserRoles.Remove(userRole);
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }
        }

        public async Task<IList<string>> GetRolesAsync(User user, CancellationToken cancellationToken)
        {
            return await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Include(ur => ur.Role)
                .Select(ur => ur.Role.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> IsInRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            Role? role = await _context.Roles
                .FirstOrDefaultAsync(r => r.NormalizedName == roleName.ToUpper(), cancellationToken);

            if (role == null)
            {
                return false;
            }

            return await _context.UserRoles
                .AnyAsync(ur => ur.UserId == user.Id && ur.RoleId == role.Id, cancellationToken);
        }

        public async Task<IList<User>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            Role? role = await _context.Roles
                .FirstOrDefaultAsync(r => r.NormalizedName == roleName.ToUpper(), cancellationToken);

            if (role == null)
            {
                return [];
            }

            return await _context.UserRoles
                .Where(ur => ur.RoleId == role.Id)
                .Include(ur => ur.User)
                .Select(ur => ur.User)
                .ToListAsync(cancellationToken);
        }
    }
}