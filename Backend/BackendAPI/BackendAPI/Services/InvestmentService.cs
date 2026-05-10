using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using BackendAPI.Interfaces;

namespace BackendAPI.Services
{
    public class InvestmentService : IInvestmentService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _http;

        public InvestmentService(AppDbContext context, IHttpContextAccessor http)
        {
            _context = context;
            _http = http;
        }

        // ================= CREATE =================
        public async Task<ServiceResult> InvestAsync(InvestDto dto)
        {
            // ===== VALIDATION =====
            if (dto.Amount <= 0)
                return new ServiceResult { Success = false, Message = "Invalid amount" };

            // ================= GET USER FROM TOKEN =================
            var userIdClaim = _http.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return new ServiceResult { Success = false, Message = "Unauthorized" };

            var investorId = int.Parse(userIdClaim);

            // ================= GET INVESTOR =================
            var investor = await _context.Investors
                .FirstOrDefaultAsync(i => i.Id == investorId);

            if (investor == null)
                return new ServiceResult { Success = false, Message = "Investor not found" };

            // ================= GET PROJECT =================
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

            // ================= BALANCE CHECK =================
            if (investor.Balance < dto.Amount)
                return new ServiceResult { Success = false, Message = "Insufficient balance" };

            // ================= CREATE INVESTMENT =================
            var investment = new Investment
            {
                InvestorId = investorId, // 👈 من التوكن
                ProjectId = dto.ProjectId,
                Amount = dto.Amount,
                Date = DateTime.UtcNow
            };

            // ================= UPDATE BALANCE =================
            investor.Balance -= dto.Amount;

            // ================= CREATE CONTRACT =================
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
                    Message = ex.Message
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

        // ================= GET MY INVESTMENTS =================
        public async Task<List<InvestmentViewDto>> GetByInvestorAsync(int investorId)
        {
            // 👇 تجاهل الـ parameter وخد من التوكن
            var userIdClaim = _http.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return new List<InvestmentViewDto>();

            var currentUserId = int.Parse(userIdClaim);

            return await _context.Investments
                .Include(i => i.Investor)
                .Include(i => i.Project)
                .Where(i => i.InvestorId == currentUserId)
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

        public async Task<List<ContractDto>> GetContractsAsync()
        {
            return await _context.Contracts
                .Include(c => c.Investment).ThenInclude(i => i.Investor)
                .Include(c => c.Investment).ThenInclude(i => i.Project)
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

        public async Task<ContractDto?> GetContractByIdAsync(int id)
        {
            return await _context.Contracts
                .Include(c => c.Investment).ThenInclude(i => i.Investor)
                .Include(c => c.Investment).ThenInclude(i => i.Project)
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
        public async Task<ProfitDto?> CalculateProfitAsync(int investmentId)
        {
            var investment = await _context.Investments
                .Include(i => i.Project)
                .Include(i => i.Contract)
                .FirstOrDefaultAsync(i => i.Id == investmentId);

            if (investment == null)
                return null;

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

            var expectedProfit = investment.Project.ExpectedProfit;
            var investorShare = investment.Contract.ProfitShare;
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

        // ================= DISTRIBUTE =================
        public async Task<ServiceResult> DistributeProfitAsync(int investmentId)
        {
            var investment = await _context.Investments
                .Include(i => i.Project)
                .Include(i => i.Contract)
                .Include(i => i.Investor)
                .FirstOrDefaultAsync(i => i.Id == investmentId);

            if (investment == null)
                return new ServiceResult { Success = false, Message = "Investment not found" };

            if (investment.Contract.Status != ContractStatus.Active)
                return new ServiceResult
                {
                    Success = false,
                    Message = "Contract is not active"
                };

            var expectedProfit = investment.Project.ExpectedProfit;
            var investorShare = investment.Contract.ProfitShare;
            var investorProfit = expectedProfit * investorShare;

            investment.Investor.Balance += investorProfit;
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