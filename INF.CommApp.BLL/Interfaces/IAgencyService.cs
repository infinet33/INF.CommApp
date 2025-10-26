using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Interfaces
{
    public interface IAgencyService
    {
        Task<Agency> CreateAgencyAsync(string name, string address, string city, string state, string zip);
        Task<Agency?> GetAgencyByExternalIdAsync(Guid externalId);
        Task<Agency> UpdateAgencyAsync(Guid externalId, string name, string address, string city, string state, string zip);
        Task<bool> DeleteAgencyAsync(Guid externalId);
        Task<IEnumerable<Agency>> GetAllAgenciesAsync();
        Task<IEnumerable<User>> GetAgencyUsersAsync(Guid agencyExternalId);
    }
}