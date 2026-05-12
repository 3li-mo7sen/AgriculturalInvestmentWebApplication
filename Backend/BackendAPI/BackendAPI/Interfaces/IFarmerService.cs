using BackendAPI.DTOs;

namespace BackendAPI.Interfaces
{
    public interface IFarmerService
    {
        Task<RoleDashboardDto> GetDashboardAsync();
        Task<WalletDto> GetWalletAsync();
        Task<List<ContractDto>> GetContractsAsync();
    }
}
