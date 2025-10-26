using System.Security.Claims;

namespace INF.CommApp.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            string? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out Guid userId) ? userId : Guid.Empty;
        }

        public static int GetInternalUserId(this ClaimsPrincipal user)
        {
            string? userIdClaim = user.FindFirst("userId")?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : 0;
        }

        public static string GetUserEmail(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;
        }

        public static string GetUserFullName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
        }

        public static string GetFirstName(this ClaimsPrincipal user)
        {
            return user.FindFirst("firstName")?.Value ?? string.Empty;
        }

        public static string GetLastName(this ClaimsPrincipal user)
        {
            return user.FindFirst("lastName")?.Value ?? string.Empty;
        }

        public static string[] GetUserRoles(this ClaimsPrincipal user)
        {
            return user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        }

        public static string GetUserType(this ClaimsPrincipal user)
        {
            return user.FindFirst("userType")?.Value ?? string.Empty;
        }

        public static int? GetAgencyId(this ClaimsPrincipal user)
        {
            string? agencyIdClaim = user.FindFirst("agencyId")?.Value;
            return int.TryParse(agencyIdClaim, out int agencyId) ? agencyId : null;
        }

        public static bool IsInRole(this ClaimsPrincipal user, params string[] roles)
        {
            string[] userRoles = user.GetUserRoles();
            return roles.Any(role => userRoles.Contains(role));
        }
    }
}