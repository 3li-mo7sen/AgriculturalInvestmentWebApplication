using BackendAPI.DTOs;

namespace BackendAPI.Interfaces
{
    public interface IProjectService
    {
        Task<List<ProjectDto>> GetAllAsync();
        Task<ProjectDto?> GetByIdAsync(int id);
        Task<List<ProjectDto>> GetByStatusAsync(string status);
        Task<List<ProjectDto>> GetPublishedProjectsAsync();
        Task<ProjectDto> CreateAsync(CreateProjectDto dto, int farmerId);
        Task<List<ProjectDto>> GetMyProjectsAsync(int farmerId);
        Task<ProjectDto?> UpdateAsync(int id, CreateProjectDto dto, int farmerId);
        Task<bool> DeleteAsync(int id, int farmerId);
        Task<List<ProjectDto>> GetPendingProjectsAsync();
        Task<List<ProjectDto>> GetApprovedProjectsAsync();
        Task<List<ProjectDto>> GetRejectedProjectsAsync();
        Task<bool> ApproveProjectAsync(int id);
        Task<bool> RejectProjectAsync(int id);

        // ADD THIS LINE HERE:
        Task<bool> RejectProjectWithReasonAsync(int id, string reason);

        Task<bool> PublishProjectAsync(int id);
    }
}