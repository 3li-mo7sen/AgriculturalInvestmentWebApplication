using BackendAPI.DTOs;
using BackendAPI.Services;

namespace BackendAPI.Interfaces
{
    public interface IAdminService
    {
        Task<object> GetDashboardAsync();
        Task<List<AdminUserDto>> GetUsersAsync(string? role, string? status, string? search);
        Task<AdminUserDto?> GetUserByIdAsync(int id);
        Task<ServiceResult> CreateUserAsync(AdminCreateUserDto dto);
        Task<ServiceResult> UpdateUserAsync(int id, UpdateProfileDto dto);
        Task<ServiceResult> UpdateUserStatusAsync(int id, string status);
        Task<ServiceResult> DeleteUserAsync(int id);
        Task<List<AdminProjectDto>> GetProjectsAsync(string? status, string? crop, string? search);
        Task<object> GetReportsAsync();
        Task<PlatformSettingsDto> GetPlatformSettingsAsync();
        Task<PlatformSettingsDto> UpdatePlatformSettingsAsync(PlatformSettingsDto dto);
    }
}
