using BackendAPI.DTOs;

namespace BackendAPI.Interfaces
{
    public interface IProjectService
    {
        // ================= GET ALL =================
        Task<List<ProjectDto>> GetAllAsync();

        // ================= GET BY ID =================
        Task<ProjectDto?> GetByIdAsync(int id);

        // ================= GET BY STATUS =================
        Task<List<ProjectDto>> GetByStatusAsync(string status);

        // ================= PUBLIC PROJECTS =================
        Task<List<ProjectDto>> GetPublishedProjectsAsync();

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

        // ================= APPROVED PROJECTS =================
        Task<List<ProjectDto>> GetApprovedProjectsAsync();

        // ================= REJECTED PROJECTS =================
        Task<List<ProjectDto>> GetRejectedProjectsAsync();

        // ================= APPROVE =================
        Task<bool> ApproveProjectAsync(int id);

        // ================= REJECT =================
        Task<bool> RejectProjectAsync(int id);

        // ================= PUBLISH =================
        Task<bool> PublishProjectAsync(int id);
    }
}
