using BackendAPI.DTOs;

namespace BackendAPI.Interfaces
{
    public interface IInvestorService
    {
        // Get all investors
        Task<List<InvestorDto>> GetAllAsync();

        // Get investor by id
        Task<InvestorDto?> GetByIdAsync(int id);
    }
}