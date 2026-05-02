using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext (IMPORTANT)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services
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
//====================================================================
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!context.Investors.Any())
    {
        var investor = new Investor
        {
            Name = "Test Investor",
            Email = "test@test.com",
            Balance = 10000
        };

        context.Investors.Add(investor);
    }

    if (!context.Projects.Any())
    {
        var farmer = new Farmer
        {
            Name = "Test Farmer"
        };

        context.Farmers.Add(farmer);
        context.SaveChanges();

        var project = new Project
        {
            CropType = "Test Project",
            Cost = 5000,
            ExpectedProfit = 2000,
            FarmerId = farmer.Id
        };

        context.Projects.Add(project);
    }

    context.SaveChanges();
}


//====================================================================
app.Run();