using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        // ================= DASHBOARD =================
        public async Task<object> GetDashboardAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var activeProjects = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Published);
            var totalInvestments = await _context.Investments.SumAsync(i => (decimal?)i.Amount) ?? 0;
            var pendingReviews = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Pending);

            var recentInvestments = await _context.Investments
                .Include(i => i.Project)
                .Include(i => i.Investor)
                .OrderByDescending(i => i.Date)
                .Take(5)
                .Select(i => new DashboardActivityDto
                {
                    Id = i.Id,
                    Type = "investment",
                    Message = $"{i.Investor.Name} invested EGP {i.Amount:N0} in {i.Project.Name}",
                    Time = i.Date.ToString("yyyy-MM-dd"),
                    Status = "success"
                })
                .ToListAsync();

            var pendingApprovals = await _context.Projects
                .Include(p => p.Farmer)
                .Where(p => p.Status == ProjectStatus.Pending)
                .OrderByDescending(p => p.Id)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    ProjectTitle = p.Name,
                    Farmer = p.Farmer.Name,
                    Amount = p.Cost,
                    Status = p.Status.ToString()
                })
                .ToListAsync();

            var userDistribution = await _context.Users
                .GroupBy(u => u.Role)
                .Select(g => new { Role = g.Key, Count = g.Count() })
                .ToListAsync();

            return new
            {
                Stats = new List<DashboardStatDto>
                {
                    new DashboardStatDto { Title = "Total Users", Value = totalUsers.ToString(), Description = "Active platform users" },
                    new DashboardStatDto { Title = "Active Projects", Value = activeProjects.ToString(), Description = "Live investment projects" },
                    new DashboardStatDto { Title = "Total Investments", Value = $"EGP {totalInvestments:N0}", Description = "Platform-wide investments" },
                    new DashboardStatDto { Title = "Pending Reviews", Value = pendingReviews.ToString(), Description = "Awaiting expert review" }
                },
                RecentActivities = recentInvestments,
                PendingApprovals = pendingApprovals,
                UserDistribution = userDistribution,
                SystemAlerts = new[]
                {
                    new { Type = "info", Message = "System is running normally", CreatedAt = DateTime.UtcNow }
                }
            };
        }

        // ================= USERS =================
        public async Task<List<AdminUserDto>> GetUsersAsync(string? role, string? status, string? search)
        {
            var users = await _context.Users.ToListAsync();
            var projectCounts = await _context.Projects
                .GroupBy(p => p.FarmerId)
                .ToDictionaryAsync(g => g.Key, g => g.Count());
            var investmentCounts = await _context.Investments
                .GroupBy(i => i.InvestorId)
                .ToDictionaryAsync(g => g.Key, g => g.Count());

            var result = users.Select(u => MapUser(u, projectCounts, investmentCounts)).ToList();

            if (!string.IsNullOrWhiteSpace(role) && role != "all")
                result = result.Where(u => string.Equals(u.Role, role, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrWhiteSpace(status) && status != "all")
                result = result.Where(u => string.Equals(u.Status, status, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrWhiteSpace(search))
            {
                result = result
                    .Where(u =>
                        u.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        u.Email.Contains(search, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            return result;
        }

        public async Task<AdminUserDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return null;

            var projectsCount = await _context.Projects.CountAsync(p => p.FarmerId == id);
            var investmentsCount = await _context.Investments.CountAsync(i => i.InvestorId == id);

            return MapUser(
                user,
                new Dictionary<int, int> { [id] = projectsCount },
                new Dictionary<int, int> { [id] = investmentsCount });
        }

        // ================= CREATE USER =================
        public async Task<ServiceResult> CreateUserAsync(AdminCreateUserDto dto)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);

            if (exists)
                return new ServiceResult { Success = false, Message = "User already exists" };

            var role = dto.Role.Trim().ToLower();
            User? user = role switch
            {
                "farmer" => new Farmer
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    FarmInfo = dto.PhoneNumber ?? "",
                    LandDetails = dto.LandDetails ?? "",
                    EmailConfirmed = true
                },
                "investor" => new Investor
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Balance = dto.Balance,
                    EmailConfirmed = true
                },
                "expert" => new ExpertTeam
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    EmailConfirmed = true
                },
                "admin" => new Admin
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    EmailConfirmed = true
                },
                _ => null
            };

            if (user == null)
                return new ServiceResult { Success = false, Message = "Invalid role" };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "User created successfully"
            };
        }

        // ================= UPDATE USER =================
        public async Task<ServiceResult> UpdateUserAsync(int id, UpdateProfileDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return new ServiceResult { Success = false, Message = "User not found" };

            var name = FirstNotEmpty(dto.Name, dto.FullName);
            if (name != null)
                user.Name = name;

            if (!string.IsNullOrWhiteSpace(dto.Email) &&
                !string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id);

                if (exists)
                    return new ServiceResult { Success = false, Message = "Email already exists" };

                user.Email = dto.Email;
            }

            if (user is Farmer farmer)
            {
                farmer.FarmInfo = FirstNotEmpty(dto.Phone, dto.PhoneNumber, dto.FarmInfo) ?? farmer.FarmInfo;
                farmer.LandDetails = FirstNotEmpty(dto.Location, dto.LandDetails) ?? farmer.LandDetails;
            }

            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "User updated successfully"
            };
        }

        // ================= UPDATE USER STATUS =================
        public async Task<ServiceResult> UpdateUserStatusAsync(int id, string status)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return new ServiceResult { Success = false, Message = "User not found" };

            status = status.Trim().ToLower();

            if (status is not ("active" or "pending" or "suspended"))
                return new ServiceResult { Success = false, Message = "Invalid status" };

            user.EmailConfirmed = status == "active";

            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "User status updated successfully"
            };
        }

        // ================= DELETE USER =================
        public async Task<ServiceResult> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return new ServiceResult { Success = false, Message = "User not found" };

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "User deleted successfully"
            };
        }

        // ================= PROJECTS =================
        public async Task<List<AdminProjectDto>> GetProjectsAsync(string? status, string? crop, string? search)
        {
            var projects = await _context.Projects
                .Include(p => p.Farmer)
                .Include(p => p.Investments)
                .ToListAsync();

            var result = projects.Select(MapProject).ToList();

            if (!string.IsNullOrWhiteSpace(status) && status != "all")
                result = result.Where(p => string.Equals(p.Status, status, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrWhiteSpace(crop) && crop != "all")
                result = result.Where(p => string.Equals(p.CropType, crop, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrWhiteSpace(search))
            {
                result = result
                    .Where(p =>
                        p.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (p.Farmer?.Contains(search, StringComparison.OrdinalIgnoreCase) ?? false))
                    .ToList();
            }

            return result;
        }

        // ================= REPORTS =================
        public async Task<object> GetReportsAsync()
        {
            var investments = await _context.Investments
                .Include(i => i.Project)
                .OrderByDescending(i => i.Date)
                .ToListAsync();

            var reports = await _context.Reports
                .Include(r => r.Project)
                .OrderByDescending(r => r.Date)
                .Take(10)
                .ToListAsync();

            var monthlyData = investments
                .GroupBy(i => new { i.Date.Year, i.Date.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                    Investments = g.Sum(i => i.Amount),
                    Count = g.Count()
                })
                .ToList();

            return new
            {
                PlatformStats = new
                {
                    TotalUsers = await _context.Users.CountAsync(),
                    TotalProjects = await _context.Projects.CountAsync(),
                    TotalInvestments = investments.Sum(i => i.Amount),
                    TotalReports = await _context.Reports.CountAsync()
                },
                MonthlyData = monthlyData,
                RecentReports = reports.Select(r => new
                {
                    r.Id,
                    r.Content,
                    r.Date,
                    ProjectName = r.Project.Name,
                    r.ProjectId
                }),
                Alerts = new[]
                {
                    new { Type = "info", Message = "Reports generated from current platform data" }
                }
            };
        }

        // ================= PLATFORM SETTINGS =================
        public Task<PlatformSettingsDto> GetPlatformSettingsAsync()
        {
            return Task.FromResult(new PlatformSettingsDto());
        }

        public Task<PlatformSettingsDto> UpdatePlatformSettingsAsync(PlatformSettingsDto dto)
        {
            return Task.FromResult(dto);
        }

        private static AdminUserDto MapUser(
            User user,
            Dictionary<int, int> projectCounts,
            Dictionary<int, int> investmentCounts)
        {
            var farmer = user as Farmer;

            return new AdminUserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role?.ToLower() ?? "",
                Status = user.EmailConfirmed ? "active" : "pending",
                KycStatus = user.EmailConfirmed ? "verified" : "pending",
                Phone = farmer?.FarmInfo,
                Location = farmer?.LandDetails,
                ProjectsCount = projectCounts.TryGetValue(user.Id, out var projectsCount) ? projectsCount : 0,
                InvestmentsCount = investmentCounts.TryGetValue(user.Id, out var investmentsCount) ? investmentsCount : 0,
                ReviewsCount = user.Role == "Expert" ? 0 : 0
            };
        }

        private static AdminProjectDto MapProject(Project project)
        {
            var fundingRaised = project.Investments?.Sum(i => i.Amount) ?? 0;

            return new AdminProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Farmer = project.Farmer?.Name,
                Location = project.Farmer?.LandDetails,
                Status = MapProjectStatus(project, fundingRaised),
                FundingGoal = project.Cost,
                FundingRaised = fundingRaised,
                InvestorCount = project.Investments?.Select(i => i.InvestorId).Distinct().Count() ?? 0,
                CropType = null,
                ExpectedRoi = project.Cost > 0 ? $"{Math.Round((project.ExpectedProfit / project.Cost) * 100)}%" : "0%"
            };
        }

        private static string MapProjectStatus(Project project, decimal fundingRaised)
        {
            return project.Status switch
            {
                ProjectStatus.Pending => "pending_review",
                ProjectStatus.Approved => "expert_review",
                ProjectStatus.Published => fundingRaised >= project.Cost ? "active" : "funding",
                ProjectStatus.Rejected => "rejected",
                _ => project.Status.ToString().ToLower()
            };
        }

        private static string? FirstNotEmpty(params string?[] values)
        {
            return values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
        }
    }
}
