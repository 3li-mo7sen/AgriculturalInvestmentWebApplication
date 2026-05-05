using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackendAPI.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return null;

            // ✅ compare hashed password
            bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

            if (!isValid)
                return null;

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Name ?? ""),
        new Claim(ClaimTypes.Email, user.Email ?? ""),
        new Claim(ClaimTypes.Role, user.Role ?? "")
    };

            var keyString = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString))
                throw new Exception("JWT Key is missing");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<(bool Success, string Message)> RegisterFarmerAsync(FarmerRegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return (false, "Passwords do not match");

            var exists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);

            if (exists)
                return (false, "User already exists");

            var farmer = new Farmer
            {
                Name = dto.Name,
                Email = dto.Email,
                // ✅ HASH password
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Farmer",
                FarmInfo = dto.PhoneNumber,
                LandDetails = dto.LandDetails
            };

            _context.Users.Add(farmer);
            await _context.SaveChangesAsync();

            return (true, "Farmer registered successfully");
        }

        public async Task<(bool Success, string Message)> RegisterInvestorAsync(InvestorRegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return (false, "Passwords do not match");

            var exists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);

            if (exists)
                return (false, "User already exists");

            var investor = new Investor
            {
                Name = dto.Name,
                Email = dto.Email,
                // ✅ HASH password
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Investor",
                Balance = 0
            };

            _context.Users.Add(investor);
            await _context.SaveChangesAsync();

            return (true, "Investor registered successfully");
        }

    }
}