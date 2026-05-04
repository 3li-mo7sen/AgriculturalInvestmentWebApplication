using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Models;
using BackendAPI.Services;
using Microsoft.EntityFrameworkCore;
namespace BackendAPI.Services
{

    public class InvestmentService : IInvestmentService
    {
        private readonly AppDbContext _context;

        public InvestmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult> InvestAsync(InvestDto dto)
        {
            if (dto.Amount <= 0)
                return new ServiceResult { Success = false, Message = "Invalid amount" };

            var investor = await _context.Investors
                .FirstOrDefaultAsync(i => i.Id == dto.InvestorId);

            if (investor == null)
                return new ServiceResult { Success = false, Message = "Investor not found" };

            var project = await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == dto.ProjectId);

            if (project == null)
                return new ServiceResult { Success = false, Message = "Project not found" };

            // (هنتأكد من status بعد شوية لما نضيفه)

            if (investor.Balance < dto.Amount)
                return new ServiceResult { Success = false, Message = "Insufficient balance" };

            var investment = new Investment
            {
                InvestorId = dto.InvestorId,
                ProjectId = dto.ProjectId,
                Amount = dto.Amount,
                Date = DateTime.UtcNow
            };

            investor.Balance -= dto.Amount;

            var contract = new Contract
            {
                Investment = investment,
                Terms = $"Investment of {dto.Amount} in project {project.Name}",
                ProfitShare = 0.2m,
                Status = ContractStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                await _context.Investments.AddAsync(investment);
                await _context.Contracts.AddAsync(contract);

                _context.Investors.Update(investor);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new ServiceResult
                {
                    Success = true,
                    Message = "Investment successful"
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                return new ServiceResult
                {
                    Success = false,
                    Message = "Server error"
                };
            }
        }
    }
}