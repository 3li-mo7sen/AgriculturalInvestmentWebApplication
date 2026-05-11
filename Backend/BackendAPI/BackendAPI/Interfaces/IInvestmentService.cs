using BackendAPI.DTOs;
using BackendAPI.Services;

namespace BackendAPI.Interfaces
{
    public interface IInvestmentService
    {
        // Create investment
        Task<ServiceResult> InvestAsync(InvestDto dto);

        // Get all investments
        Task<List<InvestmentViewDto>> GetAllAsync();

        // Get investment by id
        Task<InvestmentViewDto?> GetByIdAsync(int id);

        // Get investments by investor
        Task<List<InvestmentViewDto>> GetByInvestorAsync(int investorId);

        // Get current investor investments
        Task<List<InvestmentViewDto>> GetMyInvestmentsAsync();

        // 🔴 NEW: Get investors in a specific project
        Task<List<ProjectInvestorsDto>> GetProjectInvestorsAsync(int projectId);

        // Get investment history for the current investor
        Task<List<WalletTransactionDto>> GetMyHistoryAsync();

        // ================= CONTRACT =================

        // Get all contracts
        Task<List<ContractDto>> GetContractsAsync();

        // Get contracts for current user
        Task<List<ContractDto>> GetMyContractsAsync();

        // Get contracts by project
        Task<List<ContractDto>> GetContractsByProjectAsync(int projectId);

        // Get contract by id
        Task<ContractDto?> GetContractByIdAsync(int id);

        // Update contract status
        Task<ServiceResult> UpdateContractStatusAsync(int id, string status);

        // ================= PROFIT =================

        // Calculate profit for an investment
        Task<ProfitDto?> CalculateProfitAsync(int investmentId);

        // ================= DISTRIBUTE PROFIT =================

        // Distribute profit to investor
        Task<ServiceResult> DistributeProfitAsync(int investmentId);
    }
}
