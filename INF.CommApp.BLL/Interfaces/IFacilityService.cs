using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Interfaces
{
    public interface IFacilityService
    {
        Task<Facility> CreateFacilityAsync(string name, string address, string city, string state, string zip);
        Task<Facility?> GetFacilityByExternalIdAsync(Guid externalId);
        Task<Facility> UpdateFacilityAsync(Guid externalId, string name, string address, string city, string state, string zip);
        Task<bool> DeleteFacilityAsync(Guid externalId);
        Task<IEnumerable<Facility>> GetAllFacilitiesAsync();
        
        // Resident management within facility
        Task<Resident> AddResidentToFacilityAsync(Guid facilityExternalId, string firstName, string lastName);
        Task<Resident?> GetResidentAsync(Guid facilityExternalId, Guid residentExternalId);
        Task<Resident> UpdateResidentAsync(Guid facilityExternalId, Guid residentExternalId, string firstName, string lastName);
        Task<bool> DeleteResidentAsync(Guid facilityExternalId, Guid residentExternalId);
        
        // Staff management within facility
        Task<User> AddStaffToFacilityAsync(Guid facilityExternalId, string userName, string type, Guid? agencyExtId);
    }
}