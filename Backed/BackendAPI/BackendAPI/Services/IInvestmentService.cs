using BackendAPI.DTOs;

namespace BackendAPI.Services
{
    public interface IInvestmentService
    {
        Task<string> InvestAsync(InvestDto dto);
    }
}
