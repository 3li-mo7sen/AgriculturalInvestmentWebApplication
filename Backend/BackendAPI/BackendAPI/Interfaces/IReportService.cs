using BackendAPI.DTOs;

namespace BackendAPI.Interfaces
{
    public interface IReportService
    {
        // ================= CREATE =================
        Task<ReportDto> CreateAsync(ReportDto dto);

        // ================= GET ALL =================
        Task<List<ReportDto>> GetAllAsync();

        // ================= GET BY ID =================
        Task<ReportDto?> GetByIdAsync(int id);

        // ================= GET BY PROJECT =================
        Task<List<ReportDto>> GetByProjectAsync(int projectId);

        // ================= DELETE =================
        Task<bool> DeleteAsync(int id);
    }
}
