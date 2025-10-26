using Azure.Identity;
using INF.CommApp.BLL.Extensions;
using INF.CommApp.DATA;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add Key Vault configuration
builder.Configuration.AddAzureKeyVault(
    new Uri("https://kv-commapp-poc.vault.azure.net/"),
    new DefaultAzureCredential());

builder.Services.AddControllers();

// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

string? connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString)); // This will now work

//Configure notification services
builder.Services.AddNotificationServices();

//Configure business services
builder.Services.AddBusinessServices();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Enable Swagger middleware in all environments (recommended for development)
app.UseSwagger();
app.UseSwaggerUI();

app.Run();
