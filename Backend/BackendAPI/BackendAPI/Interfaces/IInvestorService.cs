using BackendAPI.DTOs;
using BackendAPI.Services;

namespace BackendAPI.Interfaces
{
    public interface IInvestorService
    {
        // Get all investors
        Task<List<InvestorDto>> GetAllAsync();

        // Get investor by id
        Task<InvestorDto?> GetByIdAsync(int id);

        Task<RoleDashboardDto> GetDashboardAsync();
        Task<WalletDto?> GetWalletAsync();
        Task<ServiceResult> DepositAsync(WalletActionDto dto);
        Task<ServiceResult> WithdrawAsync(WalletActionDto dto);
    }
}
