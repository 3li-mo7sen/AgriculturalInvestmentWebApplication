using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.Middleware;
using BackendAPI.Models;
using BackendAPI.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;


using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ======================== DbContext ========================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
// ==========================================================


// ======================== Services ========================
builder.Services.AddControllers();

builder.Services.AddScoped<IInvestmentService, InvestmentService>();
builder.Services.AddScoped<IInvestorService, InvestorService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IFarmerService, FarmerService>();
builder.Services.AddScoped<IExpertService, ExpertService>();

builder.Services.AddScoped<AuthService>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthorization();
// ==========================================================


// ======================== CORS ========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "http://localhost:50547",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:3001")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
// ======================================================


// ======================== Mail Service ========================
builder.WebHost.UseUrls("http://0.0.0.0:5000");
// =============================================================


// ======================== Swagger ========================
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Agri-Pro API",
        Version = "v1",
        Description = "Agricultural Investment Platform API"
    });

    // ================= JWT =================
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

});
// ======================================================


// ======================== Authentication ========================
var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrWhiteSpace(context.Token) &&
                context.Request.Cookies.ContainsKey("token"))
            {
                context.Token = context.Request.Cookies["token"];
            }

            return Task.CompletedTask;
        }
    };
});
// ===============================================================


var app = builder.Build();


// ======================== Pipeline ========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


// ======================== CORS ========================
app.UseCors("AllowAngular");


// ======================== Exception Middleware ========================
app.UseMiddleware<ExceptionMiddleware>();


// ======================== Authentication ========================
app.UseAuthentication();

app.UseAuthorization();
// ================================================================


app.MapControllers();


app.Run();
