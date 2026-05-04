using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddControllers();
builder.Services.AddScoped<IInvestmentService, InvestmentService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Pipeline
if (app.Environment.IsDevelopment())
{
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
            Balance = 10000
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
            Password = "123456"
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
}
// ==============================================

app.Run();