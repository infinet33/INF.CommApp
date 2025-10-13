using Azure.Identity;
using INF.CommApp.DATA;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models; // Add this using directive
using System;
using Swashbuckle.AspNetCore.Swagger;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add Key Vault configuration
builder.Configuration.AddAzureKeyVault(
    new Uri("https://kv-commapp-poc.vault.azure.net/"),
    new DefaultAzureCredential());

builder.Services.AddControllers();

// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString)); // This will now work

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Enable Swagger middleware in all environments (recommended for development)
app.UseSwagger();
app.UseSwaggerUI();

app.Run();
