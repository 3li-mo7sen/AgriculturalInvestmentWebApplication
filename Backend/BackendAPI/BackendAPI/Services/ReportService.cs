using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        // ================= CREATE =================
        public async Task<ReportDto> CreateAsync(ReportDto dto)
        {
            var report = new Report
            {
                Content = dto.Content,
                Date = DateTime.UtcNow,
                ProjectId = dto.ProjectId
            };

            _context.Reports.Add(report);

            await _context.SaveChangesAsync();

            dto.Id = report.Id;
            dto.Date = report.Date;

            return dto;
        }

        // ================= GET ALL =================
        public async Task<List<ReportDto>> GetAllAsync()
        {
            return await _context.Reports
                .OrderByDescending(r => r.Date)
                .Select(r => new ReportDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    Date = r.Date,
                    ProjectId = r.ProjectId
                })
                .ToListAsync();
        }

        // ================= GET BY ID =================
        public async Task<ReportDto?> GetByIdAsync(int id)
        {
            return await _context.Reports
                .Where(r => r.Id == id)
                .Select(r => new ReportDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    Date = r.Date,
                    ProjectId = r.ProjectId
                })
                .FirstOrDefaultAsync();
        }

        // ================= GET BY PROJECT =================
        public async Task<List<ReportDto>> GetByProjectAsync(int projectId)
        {
            return await _context.Reports
                .Where(r => r.ProjectId == projectId)
                .Select(r => new ReportDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    Date = r.Date,
                    ProjectId = r.ProjectId
                })
                .ToListAsync();
        }

        // ================= DELETE =================
        public async Task<bool> DeleteAsync(int id)
        {
            var report = await _context.Reports.FindAsync(id);

            if (report == null)
                return false;

            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
