using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Interfaces
{
    public interface IResidentService
    {
        Task<Resident> CreateResidentAsync(string firstName, string lastName, Guid facilityExternalId);
        Task<Resident?> GetResidentByExternalIdAsync(Guid externalId);
        Task<Resident> UpdateResidentAsync(Guid externalId, string firstName, string lastName);
        Task<bool> DeleteResidentAsync(Guid externalId);
        Task<IEnumerable<Resident>> GetAllResidentsAsync();
        Task<IEnumerable<Resident>> GetResidentsByFacilityAsync(Guid facilityExternalId);
    }
}