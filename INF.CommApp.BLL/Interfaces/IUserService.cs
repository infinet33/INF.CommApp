using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Interfaces
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(string userName, string type, Guid? agencyExtId);
        Task<User?> GetUserByExternalIdAsync(Guid externalId);
        Task<User> UpdateUserAsync(Guid externalId, string? userName, string? type);
        Task<bool> DeleteUserAsync(Guid externalId);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<IEnumerable<Resident>> GetUserResidentsAsync(Guid userExternalId);
        Task<bool> RequestAccessToResidentAsync(Guid userExternalId, Guid residentExternalId);
    }
}