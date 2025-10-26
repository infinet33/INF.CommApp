using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace INF.CommApp.API.Services
{
    public class CustomRoleStore : IRoleStore<Role>
    {
        private readonly AppDbContext _context;

        public CustomRoleStore(AppDbContext context)
        {
            _context = context;
        }

        public void Dispose()
        {
            _context?.Dispose();
            GC.SuppressFinalize(this);
        }

        public async Task<IdentityResult> CreateAsync(Role role, CancellationToken cancellationToken)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(Role role, CancellationToken cancellationToken)
        {
            _context.Roles.Remove(role);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<Role?> FindByIdAsync(string roleId, CancellationToken cancellationToken)
        {
            if (int.TryParse(roleId, out int id))
            {
                return await _context.Roles.FindAsync(new object[] { id }, cancellationToken);
            }
            return null;
        }

        public async Task<Role?> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.NormalizedName == normalizedRoleName, cancellationToken);
        }

        public Task<string?> GetNormalizedRoleNameAsync(Role role, CancellationToken cancellationToken)
        {
            return Task.FromResult<string?>(role.NormalizedName);
        }

        public Task<string> GetRoleIdAsync(Role role, CancellationToken cancellationToken)
        {
            return Task.FromResult(role.Id.ToString());
        }

        public Task<string?> GetRoleNameAsync(Role role, CancellationToken cancellationToken)
        {
            return Task.FromResult<string?>(role.Name);
        }

        public Task SetNormalizedRoleNameAsync(Role role, string? normalizedName, CancellationToken cancellationToken)
        {
            role.NormalizedName = normalizedName ?? string.Empty;
            return Task.CompletedTask;
        }

        public Task SetRoleNameAsync(Role role, string? roleName, CancellationToken cancellationToken)
        {
            role.Name = roleName ?? string.Empty;
            return Task.CompletedTask;
        }

        public async Task<IdentityResult> UpdateAsync(Role role, CancellationToken cancellationToken)
        {
            _context.Roles.Update(role);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }
    }
}