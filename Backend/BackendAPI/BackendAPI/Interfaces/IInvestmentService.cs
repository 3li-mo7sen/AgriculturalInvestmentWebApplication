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

        // 🔴 NEW: Get investors in a specific project
        Task<List<ProjectInvestorsDto>> GetProjectInvestorsAsync(int projectId);

        // ================= CONTRACT =================

        // Get all contracts
        Task<List<ContractDto>> GetContractsAsync();

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