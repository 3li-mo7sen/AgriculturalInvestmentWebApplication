using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BackendAPI.Services
{
    public class AccountService : IAccountService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _http;

        public AccountService(AppDbContext context, IHttpContextAccessor http)
        {
            _context = context;
            _http = http;
        }

        // ================= CURRENT PROFILE =================
        public async Task<UserProfileDto?> GetCurrentProfileAsync()
        {
            var user = await GetCurrentUserAsync();

            if (user == null)
                return null;

            return await MapProfileAsync(user);
        }

        // ================= UPDATE PROFILE =================
        public async Task<UserProfileDto?> UpdateProfileAsync(UpdateProfileDto dto)
        {
            var user = await GetCurrentUserAsync();

            if (user == null)
                return null;

            var name = FirstNotEmpty(dto.Name, dto.FullName);
            if (name != null)
                user.Name = name;

            if (!string.IsNullOrWhiteSpace(dto.Email) &&
                !string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var exists = await _context.Users
                    .AnyAsync(u => u.Email == dto.Email && u.Id != user.Id);

                if (exists)
                    return null;

                user.Email = dto.Email;
                user.EmailConfirmed = false;
                user.EmailVerificationToken = Guid.NewGuid().ToString();
            }

            if (user is Farmer farmer)
            {
                farmer.FarmInfo = FirstNotEmpty(dto.Phone, dto.PhoneNumber, dto.FarmInfo) ?? farmer.FarmInfo;
                farmer.LandDetails = FirstNotEmpty(dto.Location, dto.LandDetails) ?? farmer.LandDetails;
            }

            await _context.SaveChangesAsync();

            return await MapProfileAsync(user);
        }

        // ================= CHANGE PASSWORD =================
        public async Task<ServiceResult> ChangePasswordAsync(ChangePasswordDto dto)
        {
            var user = await GetCurrentUserAsync();

            if (user == null)
                return new ServiceResult { Success = false, Message = "Unauthorized" };

            if (dto.NewPassword != dto.ConfirmPassword)
                return new ServiceResult { Success = false, Message = "Passwords do not match" };

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
                return new ServiceResult { Success = false, Message = "Current password is not correct" };

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "Password changed successfully"
            };
        }

        // ================= SETTINGS =================
        public Task<AccountSettingsDto> GetSettingsAsync()
        {
            return Task.FromResult(new AccountSettingsDto());
        }

        // ================= UPDATE SETTINGS =================
        public Task<AccountSettingsDto> UpdateSettingsAsync(AccountSettingsDto dto)
        {
            return Task.FromResult(dto);
        }

        private async Task<User?> GetCurrentUserAsync()
        {
            var userIdClaim = _http.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
                return null;

            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }

        private async Task<UserProfileDto> MapProfileAsync(User user)
        {
            var farmer = user as Farmer;

            return new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                EmailConfirmed = user.EmailConfirmed,
                Status = user.EmailConfirmed ? "active" : "pending",
                KycStatus = user.EmailConfirmed ? "verified" : "pending",
                Phone = farmer?.FarmInfo,
                Location = farmer?.LandDetails,
                Stats = await GetStatsAsync(user)
            };
        }

        private async Task<object> GetStatsAsync(User user)
        {
            if (user.Role == "Farmer")
            {
                var projects = await _context.Projects
                    .Include(p => p.Investments)
                    .Where(p => p.FarmerId == user.Id)
                    .ToListAsync();

                return new
                {
                    TotalProjects = projects.Count,
                    ActiveProjects = projects.Count(p => p.Status == ProjectStatus.Published),
                    TotalInvestment = projects.Sum(p => p.Investments.Sum(i => i.Amount)),
                    Rating = 0
                };
            }

            if (user.Role == "Investor")
            {
                var investments = await _context.Investments
                    .Include(i => i.Project)
                    .Where(i => i.InvestorId == user.Id)
                    .ToListAsync();

                var totalInvested = investments.Sum(i => i.Amount);
                var totalReturns = investments.Sum(i => i.Project.Cost > 0
                    ? i.Amount * (i.Project.ExpectedProfit / i.Project.Cost)
                    : 0);

                return new
                {
                    TotalInvested = totalInvested,
                    ActiveInvestments = investments.Count,
                    TotalReturns = totalReturns,
                    AverageRoi = totalInvested > 0 ? Math.Round(totalReturns / totalInvested * 100, 2) : 0
                };
            }

            if (user.Role == "Expert")
            {
                var verified = await _context.Projects
                    .CountAsync(p => p.Status == ProjectStatus.Approved || p.Status == ProjectStatus.Published);
                var rejected = await _context.Projects
                    .CountAsync(p => p.Status == ProjectStatus.Rejected);

                return new
                {
                    TotalReviews = verified + rejected,
                    VerifiedProjects = verified,
                    RejectedProjects = rejected,
                    Rating = 0
                };
            }

            return new
            {
                TotalUsers = await _context.Users.CountAsync(),
                ActiveProjects = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Published),
                TotalInvestments = await _context.Investments.SumAsync(i => (decimal?)i.Amount) ?? 0,
                PendingApprovals = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Pending)
            };
        }

        private static string? FirstNotEmpty(params string?[] values)
        {
            return values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
        }
    }
}
