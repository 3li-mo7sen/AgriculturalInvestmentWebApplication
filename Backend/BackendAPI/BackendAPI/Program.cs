using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddControllers();
builder.Services.AddScoped<IInvestmentService, InvestmentService>();
builder.Services.AddScoped<IInvestorService, InvestorService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IReportService, ReportService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//======================== Authentication ========================
var jwtSettings = builder.Configuration.GetSection("Jwt");

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
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"]))
    };
});
//======================
var app = builder.Build();

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// =================== Seeder ===================
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Apply migrations automatically
    context.Database.Migrate();

    // Investor
    if (!context.Investors.Any())
    {
        var investor = new Investor
        {
            Name = "Test Investor",
            Email = "test@test.com",
            Password = "123456",
            Balance = 10000,
            Role = "Investor"
        };

        context.Investors.Add(investor);
        context.SaveChanges();
    }

    // Farmer + Project
    if (!context.Projects.Any())
    {
        var farmer = new Farmer
        {
            Name = "Test Farmer",
            Email = "farmer@test.com",
            Password = "123456",
            Role = "Farmer"
        };

        context.Farmers.Add(farmer);
        context.SaveChanges();

        var project = new Project
        {
            Name = "Test Project",
            Cost = 5000,
            ExpectedProfit = 2000,
            Duration = 12,
            FarmerId = farmer.Id,
            Status = ProjectStatus.Published
        };

        context.Projects.Add(project);
        context.SaveChanges();
    }

    // Expert Team
    if (!context.ExpertTeams.Any())
    {
        var expert = new ExpertTeam
        {
            Name = "Test Expert",
            Email = "expert@test.com",
            Password = "123456"
        };

        context.ExpertTeams.Add(expert);
    }

    // Admin
    if (!context.Admins.Any())
    {
        var admin = new Admin
        {
            Name = "Test Admin",
            Email = "admin@test.com",
            Password = "123456"
        };

        context.Admins.Add(admin);
    }
}
// ==============================================

app.Run();