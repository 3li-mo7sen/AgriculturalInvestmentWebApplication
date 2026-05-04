using BackendAPI.DTOs;

namespace BackendAPI.Services
{
    public interface IInvestmentService
    {
        Task<ServiceResult> InvestAsync(InvestDto dto);
    }
}
