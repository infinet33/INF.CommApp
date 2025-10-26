using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace INF.CommApp.API.Services
{
    public interface IJwtService
    {
        public Task<string> GenerateTokenAsync(User user);
        public ClaimsPrincipal? ValidateToken(string token);
    }

    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;

        public JwtService(IConfiguration configuration, UserManager<User> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        public async Task<string> GenerateTokenAsync(User user)
        {
            List<Claim> claims =
            [
                new(ClaimTypes.NameIdentifier, user.ExternalId.ToString()),
                new(ClaimTypes.Email, user.EmailAddress),
                new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new("firstName", user.FirstName),
                new("lastName", user.LastName),
                new("userId", user.Id.ToString())
            ];

            // Add role claims
            IList<string> roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Add user type claim
            if (!string.IsNullOrEmpty(user.Type))
            {
                claims.Add(new Claim("userType", user.Type));
            }

            // Add facility claim if user has one
            if (user.AgencyId.HasValue)
            {
                claims.Add(new Claim("agencyId", user.AgencyId.Value.ToString()));
            }

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["JWT:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            int expirationHours = int.Parse(_configuration["JWT:ExpirationHours"] ?? "8");
            DateTime expiresAt = DateTime.UtcNow.AddHours(expirationHours);

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                byte[] key = Encoding.UTF8.GetBytes(_configuration["JWT:Key"] ?? "");

                TokenValidationParameters validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _configuration["JWT:Issuer"],
                    ValidAudience = _configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };

                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}