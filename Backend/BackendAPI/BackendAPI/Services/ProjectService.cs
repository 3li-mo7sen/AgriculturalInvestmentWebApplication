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
                Status = ProjectStatus.Published
            };

            _context.Projects.Add(project);

            await _context.SaveChangesAsync();

            dto.Id = project.Id;
            dto.Status = project.Status.ToString();

            return dto;
        }
    }
}