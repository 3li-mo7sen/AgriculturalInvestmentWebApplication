using BackendAPI.DTOs;
using BackendAPI.Services;

namespace BackendAPI.Interfaces
{
    public interface IExpertService
    {
        Task<RoleDashboardDto> GetDashboardAsync();
        Task<List<ProjectDto>> GetPendingProjectsAsync();
        Task<List<ProjectDto>> GetVerifiedProjectsAsync();
        Task<List<ProjectDto>> GetRejectedProjectsAsync();
        Task<ServiceResult> VerifyProjectAsync(int id);
        Task<ServiceResult> RejectProjectAsync(int id, string? reason);
    }
}
