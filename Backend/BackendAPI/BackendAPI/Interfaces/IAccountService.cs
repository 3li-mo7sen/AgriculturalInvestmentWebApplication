using BackendAPI.DTOs;
using BackendAPI.Services;

namespace BackendAPI.Interfaces
{
    public interface IAccountService
    {
        Task<UserProfileDto?> GetCurrentProfileAsync();
        Task<UserProfileDto?> UpdateProfileAsync(UpdateProfileDto dto);
        Task<ServiceResult> ChangePasswordAsync(ChangePasswordDto dto);
        Task<AccountSettingsDto> GetSettingsAsync();
        Task<AccountSettingsDto> UpdateSettingsAsync(AccountSettingsDto dto);
    }
}
