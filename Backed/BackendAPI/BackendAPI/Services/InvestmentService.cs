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

        public async Task<string> InvestAsync(InvestDto dto)
        {
            var investor = await _context.Investors
                .FirstOrDefaultAsync(i => i.Id == dto.InvestorId);

            if (investor == null)
                return "Investor not found";

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == dto.ProjectId);

            if (project == null)
                return "Project not found";


            if (investor.Balance < dto.Amount)
                return "Insufficient balance";

            var investment = new Investment
            {
                InvestorId = dto.InvestorId,
                ProjectId = dto.ProjectId,
                Amount = dto.Amount,
                Date = DateTime.Now
            };

            investor.Balance -= dto.Amount;

            var contract = new Contract
            {
                Investment = investment,
                Terms = "Standard profit sharing agreement",
                CreatedAt = DateTime.Now
            };

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                await _context.Investments.AddAsync(investment);
                await _context.Contracts.AddAsync(contract);

                _context.Investors.Update(investor);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return "Investment successful";
            }
            catch
            {
                await transaction.RollbackAsync();
                return "Error occurred during investment";
            }
        }
    }
}