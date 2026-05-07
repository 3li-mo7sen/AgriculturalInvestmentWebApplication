using BackendAPI.Data;
using BackendAPI.DTOs;
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
            return await _context.Projects
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Cost = p.Cost,
                    ExpectedProfit = p.ExpectedProfit,
                    Duration = p.Duration,
                    Status = p.Status.ToString()
                })
                .ToListAsync();
        }

        // ================= GET BY ID =================
        public async Task<ProjectDto?> GetByIdAsync(int id)
        {
            return await _context.Projects
                .Where(p => p.Id == id)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Cost = p.Cost,
                    ExpectedProfit = p.ExpectedProfit,
                    Duration = p.Duration,
                    Status = p.Status.ToString()
                })
                .FirstOrDefaultAsync();
        }

        // ================= CREATE =================
        public async Task<ProjectDto> CreateAsync(ProjectDto dto, int farmerId)
        {
            var project = new Project
            {
                Name = dto.Name,
                Cost = dto.Cost,
                ExpectedProfit = dto.ExpectedProfit,
                Duration = dto.Duration,
                FarmerId = farmerId,
                Status = ProjectStatus.Pending
            };

            _context.Projects.Add(project);

            await _context.SaveChangesAsync();

            dto.Id = project.Id;
            dto.Status = project.Status.ToString();

            return dto;
        }

        // ================= MY PROJECTS =================
        public async Task<List<ProjectDto>> GetMyProjectsAsync(int farmerId)
        {
            return await _context.Projects
                .Where(p => p.FarmerId == farmerId)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Cost = p.Cost,
                    ExpectedProfit = p.ExpectedProfit,
                    Duration = p.Duration,
                    Status = p.Status.ToString()
                })
                .ToListAsync();
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
            project.Name = dto.Name;
            project.Cost = dto.Cost;
            project.ExpectedProfit = dto.ExpectedProfit;
            project.Duration = dto.Duration;

            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Cost = project.Cost,
                ExpectedProfit = project.ExpectedProfit,
                Duration = project.Duration,
                Status = project.Status.ToString()
            };
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
            return await _context.Projects
                .Where(p => p.Status == ProjectStatus.Pending)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Cost = p.Cost,
                    ExpectedProfit = p.ExpectedProfit,
                    Duration = p.Duration,
                    Status = p.Status.ToString()
                })
                .ToListAsync();
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
    }
}