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

        // ================= UPDATE =================
        Task<ProjectDto?> UpdateAsync(int id, ProjectDto dto, int farmerId);

        // ================= DELETE =================
        Task<bool> DeleteAsync(int id, int farmerId);

        // ================= PENDING PROJECTS =================
        Task<List<ProjectDto>> GetPendingProjectsAsync();

        // ================= APPROVE =================
        Task<bool> ApproveProjectAsync(int id);

        // ================= REJECT =================
        Task<bool> RejectProjectAsync(int id);

        // ================= PUBLISH =================
        Task<bool> PublishProjectAsync(int id);
    }
}