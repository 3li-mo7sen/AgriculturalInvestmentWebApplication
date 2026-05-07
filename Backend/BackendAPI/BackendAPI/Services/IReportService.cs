using BackendAPI.DTOs;

namespace BackendAPI.Services
{
    public interface IReportService
    {
        // ================= CREATE =================
        Task<ReportDto> CreateAsync(ReportDto dto);

        // ================= GET BY PROJECT =================
        Task<List<ReportDto>> GetByProjectAsync(int projectId);
    }
}