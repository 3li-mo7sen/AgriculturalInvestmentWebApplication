using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        // ================= GET ALL =================
        public async Task<List<ProjectDto>> GetAllAsync()
        {
            var projects = await GetProjectQuery().ToListAsync();
            return projects.Select(MapProject).ToList();
        }

        // ================= GET BY ID =================
        public async Task<ProjectDto?> GetByIdAsync(int id)
        {
            var project = await GetProjectQuery()
                .FirstOrDefaultAsync(p => p.Id == id);

            return project == null ? null : MapProject(project);
        }

        // ================= GET BY STATUS =================
        public async Task<List<ProjectDto>> GetByStatusAsync(string status)
        {
            if (!TryParseProjectStatus(status, out var projectStatus))
                return new List<ProjectDto>();

            var projects = await GetProjectQuery()
                .Where(p => p.Status == projectStatus)
                .ToListAsync();

            return projects.Select(MapProject).ToList();
        }

        // ================= PUBLIC PROJECTS =================
        public async Task<List<ProjectDto>> GetPublishedProjectsAsync()
        {
            var projects = await GetProjectQuery()
                .Where(p => p.Status == ProjectStatus.Published)
                .ToListAsync();

            return projects.Select(MapProject).ToList();
        }

        // ================= CREATE =================
        public async Task<ProjectDto> CreateAsync(ProjectDto dto, int farmerId)
        {
            var cost = GetProjectCost(dto);
            var expectedProfit = GetExpectedProfit(dto, cost);

            var project = new Project
            {
                Name = GetProjectName(dto),
                Cost = cost,
                ExpectedProfit = expectedProfit,
                Duration = dto.Duration > 0 ? dto.Duration : 1,
                FarmerId = farmerId,
                Status = ProjectStatus.Pending
            };

            _context.Projects.Add(project);

            await _context.SaveChangesAsync();

            var createdProject = await GetProjectQuery()
                .FirstAsync(p => p.Id == project.Id);

            return MapProject(createdProject);
        }

        // ================= MY PROJECTS =================
        public async Task<List<ProjectDto>> GetMyProjectsAsync(int farmerId)
        {
            var projects = await GetProjectQuery()
                .Where(p => p.FarmerId == farmerId)
                .ToListAsync();

            return projects.Select(MapProject).ToList();
        }

        // ================= UPDATE =================
        public async Task<ProjectDto?> UpdateAsync(int id, ProjectDto dto, int farmerId)
        {
            // ===== Get Project =====
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return null;

            // ===== Ownership Check =====
            if (project.FarmerId != farmerId)
                return null;

            // ===== Update Data =====
            project.Name = GetProjectName(dto);
            project.Cost = GetProjectCost(dto);
            project.ExpectedProfit = GetExpectedProfit(dto, project.Cost);
            project.Duration = dto.Duration > 0 ? dto.Duration : project.Duration;

            await _context.SaveChangesAsync();

            var updatedProject = await GetProjectQuery()
                .FirstAsync(p => p.Id == project.Id);

            return MapProject(updatedProject);
        }

        // ================= DELETE =================
        public async Task<bool> DeleteAsync(int id, int farmerId)
        {
            // ===== Get Project =====
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return false;

            // ===== Ownership Check =====
            if (project.FarmerId != farmerId)
                return false;

            // ===== Business Rule =====
            // Farmer can delete only pending projects
            if (project.Status != ProjectStatus.Pending)
                return false;

            // ===== Delete =====
            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();

            return true;
        }

        // ================= PENDING PROJECTS =================
        public async Task<List<ProjectDto>> GetPendingProjectsAsync()
        {
            return await GetByStatusAsync(ProjectStatus.Pending.ToString());
        }

        // ================= APPROVED PROJECTS =================
        public async Task<List<ProjectDto>> GetApprovedProjectsAsync()
        {
            return await GetByStatusAsync(ProjectStatus.Approved.ToString());
        }

        // ================= REJECTED PROJECTS =================
        public async Task<List<ProjectDto>> GetRejectedProjectsAsync()
        {
            return await GetByStatusAsync(ProjectStatus.Rejected.ToString());
        }

        // ================= APPROVE =================
        public async Task<bool> ApproveProjectAsync(int id)
        {
            // ===== Get Project =====
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return false;

            // ===== Only Pending =====
            if (project.Status != ProjectStatus.Pending)
                return false;

            // ===== Approve =====
            project.Status = ProjectStatus.Approved;

            await _context.SaveChangesAsync();

            return true;
        }

        // ================= REJECT =================
        public async Task<bool> RejectProjectAsync(int id)
        {
            // ===== Get Project =====
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return false;

            // ===== Only Pending =====
            if (project.Status != ProjectStatus.Pending)
                return false;

            // ===== Reject =====
            project.Status = ProjectStatus.Rejected;

            await _context.SaveChangesAsync();

            return true;
        }

        // ================= PUBLISH =================
        public async Task<bool> PublishProjectAsync(int id)
        {
            // ===== Get Project =====
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return false;

            // ===== Only Approved =====
            if (project.Status != ProjectStatus.Approved)
                return false;

            // ===== Publish =====
            project.Status = ProjectStatus.Published;

            await _context.SaveChangesAsync();

            return true;
        }

        private IQueryable<Project> GetProjectQuery()
        {
            return _context.Projects
                .Include(p => p.Farmer)
                .Include(p => p.Investments);
        }

        private static ProjectDto MapProject(Project project)
        {
            var fundingRaised = project.Investments?.Sum(i => i.Amount) ?? 0;
            var fundingProgress = project.Cost > 0
                ? (int)Math.Min(100, Math.Round((fundingRaised / project.Cost) * 100))
                : 0;
            var roi = project.Cost > 0
                ? $"{Math.Round((project.ExpectedProfit / project.Cost) * 100)}%"
                : "0%";

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Title = project.Name,
                ProjectTitle = project.Name,
                Cost = project.Cost,
                FundingAmount = project.Cost,
                TargetAmount = project.Cost,
                FundingRaised = fundingRaised,
                FundingProgress = fundingProgress,
                InvestorsCount = project.Investments?.Select(i => i.InvestorId).Distinct().Count() ?? 0,
                ExpectedProfit = project.ExpectedProfit,
                ExpectedRoi = roi,
                Roi = roi,
                Duration = project.Duration,
                FarmerId = project.FarmerId,
                FarmerName = project.Farmer?.Name,
                Location = project.Farmer?.LandDetails,
                LandSize = project.Farmer?.LandDetails,
                Status = project.Status.ToString()
            };
        }

        private static string GetProjectName(ProjectDto dto)
        {
            return FirstNotEmpty(dto.Name, dto.Title, dto.ProjectTitle, dto.LandName)
                ?? "New Agricultural Project";
        }

        private static bool TryParseProjectStatus(string status, out ProjectStatus projectStatus)
        {
            var normalizedStatus = status.Trim().Replace("-", "_").ToLower();

            projectStatus = normalizedStatus switch
            {
                "pending" or "pending_review" => ProjectStatus.Pending,
                "approved" or "expert_review" or "verified" => ProjectStatus.Approved,
                "published" or "funding" or "active" => ProjectStatus.Published,
                "rejected" => ProjectStatus.Rejected,
                _ => default
            };

            return normalizedStatus is
                "pending" or "pending_review" or
                "approved" or "expert_review" or "verified" or
                "published" or "funding" or "active" or
                "rejected";
        }

        private static decimal GetProjectCost(ProjectDto dto)
        {
            if (dto.Cost > 0)
                return dto.Cost;

            if (dto.FundingAmount.HasValue && dto.FundingAmount.Value > 0)
                return dto.FundingAmount.Value;

            if (dto.TargetAmount.HasValue && dto.TargetAmount.Value > 0)
                return dto.TargetAmount.Value;

            return 1;
        }

        private static decimal GetExpectedProfit(ProjectDto dto, decimal cost)
        {
            if (dto.ExpectedProfit > 0)
                return dto.ExpectedProfit;

            var roi = FirstNotEmpty(dto.ExpectedRoi, dto.Roi);
            var roiNumber = ParseFirstNumber(roi);

            if (roiNumber > 0)
                return cost * roiNumber / 100;

            return cost * 0.15m;
        }

        private static decimal ParseFirstNumber(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return 0;

            var chars = value.TakeWhile(c => char.IsDigit(c) || c == '.').ToArray();
            return decimal.TryParse(new string(chars), out var result) ? result : 0;
        }

        private static string? FirstNotEmpty(params string?[] values)
        {
            return values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
        }
    }
}
