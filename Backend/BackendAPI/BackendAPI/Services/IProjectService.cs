using BackendAPI.DTOs;

namespace BackendAPI.Services
{
    public interface IProjectService
    {
        // ================= GET ALL =================
        Task<List<ProjectDto>> GetAllAsync();

        // ================= GET BY ID =================
        Task<ProjectDto?> GetByIdAsync(int id);

        // ================= CREATE =================
        Task<ProjectDto> CreateAsync(ProjectDto dto, int farmerId);

        // ================= MY PROJECTS =================
        Task<List<ProjectDto>> GetMyProjectsAsync(int farmerId);
    }
}