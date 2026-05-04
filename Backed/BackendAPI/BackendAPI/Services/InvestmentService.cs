using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Models;
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

        // ================= CREATE =================
        public async Task<ServiceResult> InvestAsync(InvestDto dto)
        {
            if (dto.Amount <= 0)
                return new ServiceResult { Success = false, Message = "Invalid amount" };

            var investor = await _context.Investors
                .FirstOrDefaultAsync(i => i.Id == dto.InvestorId);

            if (investor == null)
                return new ServiceResult { Success = false, Message = "Investor not found" };

            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == dto.ProjectId);

            if (project == null)
                return new ServiceResult { Success = false, Message = "Project not found" };

            if (project.Status != ProjectStatus.Published)
                return new ServiceResult
                {
                    Success = false,
                    Message = "Project is not available for investment"
                };

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
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return new ServiceResult
                {
                    Success = false,
                    Message = ex.Message // مهم للتشخيص
                };
            }
        }

        // ================= GET ALL =================
        public async Task<List<InvestmentViewDto>> GetAllAsync()
        {
            return await _context.Investments
                .Include(i => i.Investor)
                .Include(i => i.Project)
                .Select(i => new InvestmentViewDto
                {
                    Id = i.Id,
                    Amount = i.Amount,
                    Date = i.Date,
                    InvestorName = i.Investor.Name,
                    ProjectName = i.Project.Name
                })
                .ToListAsync();
        }

        // ================= GET BY ID =================
        public async Task<InvestmentViewDto?> GetByIdAsync(int id)
        {
            return await _context.Investments
                .Include(i => i.Investor)
                .Include(i => i.Project)
                .Where(i => i.Id == id)
                .Select(i => new InvestmentViewDto
                {
                    Id = i.Id,
                    Amount = i.Amount,
                    Date = i.Date,
                    InvestorName = i.Investor.Name,
                    ProjectName = i.Project.Name
                })
                .FirstOrDefaultAsync();
        }

        // ================= GET BY INVESTOR =================
        public async Task<List<InvestmentViewDto>> GetByInvestorAsync(int investorId)
        {
            return await _context.Investments
                .Include(i => i.Investor)
                .Include(i => i.Project)
                .Where(i => i.InvestorId == investorId)
                .Select(i => new InvestmentViewDto
                {
                    Id = i.Id,
                    Amount = i.Amount,
                    Date = i.Date,
                    InvestorName = i.Investor.Name,
                    ProjectName = i.Project.Name
                })
                .ToListAsync();
        }
    
        // ================= GET PROJECT INVESTORS =================
        public async Task<List<ProjectInvestorsDto>> GetProjectInvestorsAsync(int projectId)
        {
            return await _context.Investments
                .Include(i => i.Investor)
                .Where(i => i.ProjectId == projectId)
                .Select(i => new ProjectInvestorsDto
                {
                    InvestorId = i.InvestorId,
                    InvestorName = i.Investor.Name,
                    Amount = i.Amount,
                    Date = i.Date
                })
                .ToListAsync();
        }


        // ================= CONTRACT =================

        // Get all contracts
        public async Task<List<ContractDto>> GetContractsAsync()
        {
            return await _context.Contracts
                .Include(c => c.Investment)
                .ThenInclude(i => i.Investor)
                .Include(c => c.Investment)
                .ThenInclude(i => i.Project)
                .Select(c => new ContractDto
                {
                    Id = c.Id,
                    ProfitShare = c.ProfitShare,
                    Status = c.Status.ToString(),
                    CreatedAt = c.CreatedAt,
                    InvestmentId = c.InvestmentId,
                    InvestorName = c.Investment.Investor.Name,
                    ProjectName = c.Investment.Project.Name
                })
                .ToListAsync();
        }

        // Get contract by id
        public async Task<ContractDto?> GetContractByIdAsync(int id)
        {
            return await _context.Contracts
                .Include(c => c.Investment)
                .ThenInclude(i => i.Investor)
                .Include(c => c.Investment)
                .ThenInclude(i => i.Project)
                .Where(c => c.Id == id)
                .Select(c => new ContractDto
                {
                    Id = c.Id,
                    ProfitShare = c.ProfitShare,
                    Status = c.Status.ToString(),
                    CreatedAt = c.CreatedAt,
                    InvestmentId = c.InvestmentId,
                    InvestorName = c.Investment.Investor.Name,
                    ProjectName = c.Investment.Project.Name
                })
                .FirstOrDefaultAsync();
        }

        // Update contract status
        public async Task<ServiceResult> UpdateContractStatusAsync(int id, string status)
        {
            var contract = await _context.Contracts.FindAsync(id);

            if (contract == null)
                return new ServiceResult { Success = false, Message = "Contract not found" };

            if (!Enum.TryParse<ContractStatus>(status, true, out var newStatus))
                return new ServiceResult { Success = false, Message = "Invalid status" };

            contract.Status = newStatus;

            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "Contract updated successfully"
            };
        }

        // ================= PROFIT =================

        // Calculate profit for an investment
        public async Task<ProfitDto?> CalculateProfitAsync(int investmentId)
        {
            var investment = await _context.Investments
                .Include(i => i.Project)
                .Include(i => i.Contract)
                .FirstOrDefaultAsync(i => i.Id == investmentId);

            if (investment == null)
                return null;

            // لازم العقد يكون Active
            if (investment.Contract.Status != ContractStatus.Active)
                return new ProfitDto
                {
                    InvestmentId = investment.Id,
                    InvestedAmount = investment.Amount,
                    ExpectedProfit = 0,
                    InvestorProfit = 0,
                    ProjectName = investment.Project.Name,
                    Status = "Contract is not active"
                };

            // حساب نسبة المستثمر من الربح
            var expectedProfit = investment.Project.ExpectedProfit;

            var investorShare = investment.Contract.ProfitShare; // 0.2 = 20%

            var investorProfit = expectedProfit * investorShare;

            return new ProfitDto
            {
                InvestmentId = investment.Id,
                InvestedAmount = investment.Amount,
                ExpectedProfit = expectedProfit,
                InvestorProfit = investorProfit,
                ProjectName = investment.Project.Name,
                Status = "Active"
            };
        }

        // ================= DISTRIBUTE PROFIT =================

        // Distribute profit to investor
        public async Task<ServiceResult> DistributeProfitAsync(int investmentId)
        {
            var investment = await _context.Investments
                .Include(i => i.Project)
                .Include(i => i.Contract)
                .Include(i => i.Investor)
                .FirstOrDefaultAsync(i => i.Id == investmentId);

            if (investment == null)
                return new ServiceResult { Success = false, Message = "Investment not found" };

            // لازم العقد يكون Active
            if (investment.Contract.Status != ContractStatus.Active)
                return new ServiceResult
                {
                    Success = false,
                    Message = "Contract is not active"
                };

            // حساب الربح
            var expectedProfit = investment.Project.ExpectedProfit;
            var investorShare = investment.Contract.ProfitShare;

            var investorProfit = expectedProfit * investorShare;

            // إضافة الربح للـ Balance
            investment.Investor.Balance += investorProfit;

            // تحديث حالة العقد
            investment.Contract.Status = ContractStatus.Completed;

            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = $"Profit distributed: {investorProfit}"
            };
        }



    }
}