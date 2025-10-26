using Azure.Identity;
using INF.CommApp.API.Services;
using INF.CommApp.BLL.Extensions;
using INF.CommApp.DATA;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add Key Vault configuration (Production only)
if (builder.Environment.IsProduction())
{
    builder.Configuration.AddAzureKeyVault(
        new Uri("https://kv-commapp-poc.vault.azure.net/"),
        new DefaultAzureCredential());
}

builder.Services.AddControllers();

// Add Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration["ConnectionStrings:DefaultConnection"]));

// Add Identity services with custom stores
builder.Services.AddTransient<IUserStore<User>, CustomUserStore>();
builder.Services.AddTransient<IRoleStore<Role>, CustomRoleStore>();

builder.Services.AddIdentity<User, Role>(options =>
{
    // Password settings for healthcare compliance
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false; // Set to true in production
})
.AddDefaultTokenProviders();

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"] ??
                throw new InvalidOperationException("JWT:Key not configured")))
    };
});

// Add custom services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IRoleSeederService, RoleSeederService>();

// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Configure notification services
builder.Services.AddNotificationServices();

//Configure business services
builder.Services.AddBusinessServices();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Enable Swagger middleware in all environments (recommended for development)
app.UseSwagger();
app.UseSwaggerUI();

// Seed roles on startup
using (IServiceScope scope = app.Services.CreateScope())
{
    IRoleSeederService roleSeeder = scope.ServiceProvider.GetRequiredService<IRoleSeederService>();
    await roleSeeder.SeedRolesAsync();
}

app.Run();

// Make Program accessible to test projects
public partial class Program { }
