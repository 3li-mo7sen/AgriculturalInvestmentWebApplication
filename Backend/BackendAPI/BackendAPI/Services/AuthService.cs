using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using BackendAPI.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        private readonly IEmailService emailService;   
        public AuthService(AppDbContext context, IConfiguration config, IEmailService emailService)
        {
            _context = context;
            _config = config;
            this.emailService = emailService;
        }

        public async Task<string?> LoginAsync(LoginDto dto)
        {
            if(string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return "please check your email and password, something went wrong";
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                return "please check your email and password, something went wrong";
            }
            //  check if email is confirmed
            if (!user.EmailConfirmed)
            {
                var Token = Guid.NewGuid().ToString();
                user.EmailVerificationToken = Token;
                await _context.SaveChangesAsync();

                await SendEmail(user.Email, Token, "active", "ActiveEmail", "Please active your email, click on button to active");
                return "Please confirem your email first, we have send activat to your E-mail";
            }
            //  compare hashed password
            bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

            if (!isValid)
            {
                return "please check your email and password, something went wrong";
            }
               

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

            // 1) Generate verification token
            var token = Guid.NewGuid().ToString();

            var farmer = new Farmer
            {
                Name = dto.Name,
                Email = dto.Email,

                // HASH password
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),

                Role = "Farmer",
                FarmInfo = dto.PhoneNumber,
                LandDetails = dto.LandDetails,

                // Email not verified yet
                EmailConfirmed = false,

                // Save token in DB
                EmailVerificationToken = token
            };

            _context.Users.Add(farmer);
            await _context.SaveChangesAsync();

            // 2) Send email
            await SendEmail(
               farmer.Email,
               token,
               "active",
               "Active Email",
               "Please verify your email");


            return (true, "Farmer registered successfully. Please check your email to verify account");
        }

        public async Task<(bool Success, string Message)> RegisterInvestorAsync(InvestorRegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return (false, "Passwords do not match");

            var exists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);

            if (exists)
                return (false, "User already exists");

            // 1) Generate token
            var token = Guid.NewGuid().ToString();

            var investor = new Investor
            {
                Name = dto.Name,
                Email = dto.Email,

                // HASH password
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),

                Role = "Investor",
                Balance = 0,

                //  not verified yet
                EmailConfirmed = false,

                //  store token
                EmailVerificationToken = token
            };

            _context.Users.Add(investor);
            await _context.SaveChangesAsync();

            // 3) send email
            await SendEmail(
               investor.Email,
               token,
               "active",
               "Active Email",
               "Please verify your email");

            return (true, "Investor registered successfully. Please verify your email.");
        }

        public async Task<ServiceResult> RegisterExpertAsync(ExpertRegisterDto dto)
        {
            // ===== Confirm Password =====
            if (dto.Password != dto.ConfirmPassword)
            {
                return new ServiceResult
                {
                    Success = false,
                    Message = "Passwords do not match"
                };
            }

            // ===== Check Email =====
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
            {
                return new ServiceResult
                {
                    Success = false,
                    Message = "Email already exists"
                };
            }

            // ===== Generate Token =====
            var token = Guid.NewGuid().ToString();

            // ===== Create Expert =====
            var expert = new ExpertTeam
            {
                Name = dto.Name,
                Email = dto.Email,

                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),

                //  Email not verified yet
                EmailConfirmed = false,

                //  Save token
                EmailVerificationToken = token
            };

            await _context.ExpertTeams.AddAsync(expert);
            await _context.SaveChangesAsync();

            // ===== Send Email =====
            await SendEmail(
               expert.Email,
               token,
               "active",
               "Active Email",
               "Please verify your email");


            return new ServiceResult
            {
                Success = true,
                Message = "Expert registered successfully. Please verify your email."
            };
        }

        public async Task SendEmail(string email, string code, string component, string subject, string message)
        {
            var result = new EmailDTO(email, _config["EmailSetting:From"], subject, EmailStringBody.send(email, code, component, message));

            await emailService.SendEmail(result);
        }

        public async Task<(bool Success, string Message)> ActiveAccount(ActiveAccountDTO accountDTO)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Email == accountDTO.Email &&
                    x.EmailVerificationToken == accountDTO.Token);

            if (user == null)
                return (false, "Invalid email or token");

            if (user.EmailConfirmed)
                return (true, "Account already verified");

            if (user.EmailVerificationTokenExpiry < DateTime.UtcNow)
                return (false, "Token expired");

            user.EmailConfirmed = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpiry = null;

            await _context.SaveChangesAsync();

            return (true, "Account activated successfully");
        }

        public async Task<bool> SendEmailForForgetPassword(string email)
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null)
                return false;

            var token = Guid.NewGuid().ToString();

            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync();

            await SendEmail(
                user.Email,
                token,
                "reset-password",
                "Reset your password",
                "Click the link to reset your password"
            );

            return true;

        }

        public async Task<string> ResetPassword(RestPasswordDTO restPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == restPassword.Email);

            if (user is null)
                return "user not found";

            if (user.ResetToken != restPassword.Token)
                return "invalid token";

            if (user.ResetTokenExpiry < DateTime.UtcNow)
                return "token expired";

            // Hash password manually
            user.Password = BCrypt.Net.BCrypt.HashPassword(restPassword.Password);

            // clear token after success
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return "done";
        }

        public async Task<(bool Success, string Message)> ResendActivationEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
                return (false, "User not found");

            if (user.EmailConfirmed)
                return (false, "Account already activated");

            // 1. Generate new token
            var token = Guid.NewGuid().ToString();
            user.EmailVerificationToken = token;
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();

            // 2. Send email again
            await SendEmail(
                user.Email,
                token,
                "active",
                "Activate your account",
                "Please verify your email again"
            );

            return (true, "Activation email sent successfully");
        }

    }
}