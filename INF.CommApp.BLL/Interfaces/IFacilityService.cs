using INF.CommApp.DATA.Models;

namespace INF.CommApp.BLL.Interfaces
{
    /// <summary>
    /// Service interface for facility management and multi-tenancy operations
    /// </summary>
    public interface IFacilityService
    {
        // Facility Management
        Task<Facility> CreateFacilityAsync(string name, string address, string city, string state, string zip);
        Task<Facility?> GetFacilityByExternalIdAsync(Guid externalId);
        Task<Facility?> GetFacilityByIdAsync(int id);
        Task<IEnumerable<Facility>> GetAllFacilitiesAsync();
        Task<Facility> UpdateFacilityAsync(Guid externalId, string name, string address, string city, string state, string zip);
        Task<bool> DeleteFacilityAsync(Guid externalId);

        // Resident Management (Legacy Support)
        Task<Resident> AddResidentToFacilityAsync(Guid facilityExternalId, string firstName, string lastName);
        Task<Resident?> GetResidentAsync(Guid facilityExternalId, Guid residentExternalId);
        Task<Resident> UpdateResidentAsync(Guid facilityExternalId, Guid residentExternalId, string firstName, string lastName);
        Task<bool> DeleteResidentAsync(Guid facilityExternalId, Guid residentExternalId);

        // Staff Management (Legacy Support) 
        Task<User> AddStaffToFacilityAsync(Guid facilityExternalId, string userName, string type, Guid? agencyExtId);

        // User-Facility Multi-Tenancy Management
        Task<bool> AssignUserToFacilityAsync(int userId, int facilityId, string? roleAtFacility = null);
        Task<bool> AssignUserToFacilityAsync(Guid userExternalId, Guid facilityExternalId, string? roleAtFacility = null);
        Task<bool> RemoveUserFromFacilityAsync(int userId, int facilityId);
        Task<bool> RemoveUserFromFacilityAsync(Guid userExternalId, Guid facilityExternalId);
        Task<bool> UpdateUserFacilityRoleAsync(int userId, int facilityId, string roleAtFacility);
        Task<bool> DeactivateUserAtFacilityAsync(int userId, int facilityId, DateTime? endDate = null);

        // Query Operations
        Task<IEnumerable<Facility>> GetUserFacilitiesAsync(int userId);
        Task<IEnumerable<Facility>> GetUserFacilitiesAsync(Guid userExternalId);
        Task<IEnumerable<User>> GetFacilityUsersAsync(int facilityId, bool activeOnly = true);
        Task<IEnumerable<User>> GetFacilityUsersAsync(Guid facilityExternalId, bool activeOnly = true);
        Task<IEnumerable<UserFacility>> GetUserFacilityAssignmentsAsync(int userId);
        Task<IEnumerable<UserFacility>> GetFacilityUserAssignmentsAsync(int facilityId);

        // Validation Operations
        Task<bool> IsUserAssignedToFacilityAsync(int userId, int facilityId);
        Task<bool> IsUserAssignedToFacilityAsync(Guid userExternalId, Guid facilityExternalId);
        Task<bool> CanUserAccessFacilityAsync(int userId, int facilityId);
        Task<string?> GetUserRoleAtFacilityAsync(int userId, int facilityId);

        // Bulk Operations
        Task<int> AssignMultipleUsersToFacilityAsync(IEnumerable<int> userIds, int facilityId, string? defaultRole = null);
        Task<int> AssignUserToMultipleFacilitiesAsync(int userId, IEnumerable<int> facilityIds, string? defaultRole = null);
    }
}