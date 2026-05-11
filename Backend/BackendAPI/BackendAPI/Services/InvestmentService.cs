using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
            var investorId = GetCurrentUserId();

            if (investorId == null)
                return new ServiceResult { Success = false, Message = "Unauthorized" };

            // ================= GET INVESTOR =================
            var investor = await _context.Investors
                .FirstOrDefaultAsync(i => i.Id == investorId.Value);

            if (investor == null)
                return new ServiceResult { Success = false, Message = "Investor not found" };

            // ================= GET PROJECT =================
            var project = await _context.Projects
                .Include(p => p.Investments)
                .FirstOrDefaultAsync(p => p.Id == dto.ProjectId);

            if (project == null)
                return new ServiceResult { Success = false, Message = "Project not found" };

            if (project.Status != ProjectStatus.Published)
            {
                return new ServiceResult
                {
                    Success = false,
                    Message = "Project is not available for investment"
                };
            }

            var raised = project.Investments?.Sum(i => i.Amount) ?? 0;
            var remaining = project.Cost - raised;

            if (remaining <= 0)
                return new ServiceResult { Success = false, Message = "Project is fully funded" };

            if (dto.Amount > remaining)
                return new ServiceResult { Success = false, Message = $"Maximum available amount is {remaining}" };

            // ================= BALANCE CHECK =================
            if (investor.Balance < dto.Amount)
                return new ServiceResult { Success = false, Message = "Insufficient balance" };

            // ================= CREATE INVESTMENT =================
            var investment = new Investment
            {
                InvestorId = investorId.Value,
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
            var investments = await GetInvestmentQuery().ToListAsync();
            return investments.Select(MapInvestment).ToList();
        }

        // ================= GET BY ID =================
        public async Task<InvestmentViewDto?> GetByIdAsync(int id)
        {
            var investment = await GetInvestmentQuery()
                .FirstOrDefaultAsync(i => i.Id == id);

            return investment == null ? null : MapInvestment(investment);
        }

        // ================= GET MY INVESTMENTS =================
        public async Task<List<InvestmentViewDto>> GetByInvestorAsync(int investorId)
        {
            var currentUserId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            if (currentUserId == null && investorId <= 0)
                return new List<InvestmentViewDto>();

            var targetInvestorId = role == "Admin" && investorId > 0
                ? investorId
                : currentUserId!.Value;

            var investments = await GetInvestmentQuery()
                .Where(i => i.InvestorId == targetInvestorId)
                .ToListAsync();

            return investments.Select(MapInvestment).ToList();
        }

        // ================= GET MY INVESTMENTS =================
        public async Task<List<InvestmentViewDto>> GetMyInvestmentsAsync()
        {
            return await GetByInvestorAsync(0);
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

        // ================= HISTORY =================
        public async Task<List<WalletTransactionDto>> GetMyHistoryAsync()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
                return new List<WalletTransactionDto>();

            return await GetInvestmentQuery()
                .Where(i => i.InvestorId == currentUserId.Value)
                .OrderByDescending(i => i.Date)
                .Select(i => new WalletTransactionDto
                {
                    Id = i.Id,
                    Type = "investment",
                    Description = $"Investment in {i.Project.Name}",
                    Amount = -i.Amount,
                    Date = i.Date,
                    Status = i.Contract.Status.ToString(),
                    ProjectName = i.Project.Name
                })
                .ToListAsync();
        }

        // ================= CONTRACT =================
        public async Task<List<ContractDto>> GetContractsAsync()
        {
            var contracts = await GetContractQuery().ToListAsync();
            return contracts.Select(MapContract).ToList();
        }

        public async Task<List<ContractDto>> GetMyContractsAsync()
        {
            var currentUserId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            if (currentUserId == null)
                return new List<ContractDto>();

            var query = GetContractQuery();

            if (role == "Farmer")
            {
                query = query.Where(c => c.Investment.Project.FarmerId == currentUserId.Value);
            }
            else if (role == "Investor")
            {
                query = query.Where(c => c.Investment.InvestorId == currentUserId.Value);
            }

            var contracts = await query.ToListAsync();
            return contracts.Select(MapContract).ToList();
        }

        public async Task<List<ContractDto>> GetContractsByProjectAsync(int projectId)
        {
            var contracts = await GetContractQuery()
                .Where(c => c.Investment.ProjectId == projectId)
                .ToListAsync();

            return contracts.Select(MapContract).ToList();
        }

        public async Task<ContractDto?> GetContractByIdAsync(int id)
        {
            var contract = await GetContractQuery()
                .FirstOrDefaultAsync(c => c.Id == id);

            return contract == null ? null : MapContract(contract);
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

        private IQueryable<Investment> GetInvestmentQuery()
        {
            return _context.Investments
                .Include(i => i.Investor)
                .Include(i => i.Project)
                .Include(i => i.Contract);
        }

        private IQueryable<Contract> GetContractQuery()
        {
            return _context.Contracts
                .Include(c => c.Investment).ThenInclude(i => i.Investor)
                .Include(c => c.Investment).ThenInclude(i => i.Project)
                .Include(c => c.Investment).ThenInclude(i => i.Project)
                    .ThenInclude(p => p.Investments)
                    .ThenInclude(i => i.Investor);
        }

        private static InvestmentViewDto MapInvestment(Investment investment)
        {
            var expectedReturn = investment.Project.Cost > 0
                ? investment.Amount * (investment.Project.ExpectedProfit / investment.Project.Cost)
                : 0;

            return new InvestmentViewDto
            {
                Id = investment.Id,
                InvestorId = investment.InvestorId,
                ProjectId = investment.ProjectId,
                Amount = investment.Amount,
                ExpectedReturn = expectedReturn,
                Date = investment.Date,
                Status = investment.Contract?.Status.ToString() ?? "Pending",
                InvestorName = investment.Investor.Name,
                ProjectName = investment.Project.Name
            };
        }

        private static ContractDto MapContract(Contract contract)
        {
            var projectInvestments = contract.Investment.Project.Investments ?? new List<Investment>();

            return new ContractDto
            {
                Id = contract.Id,
                ContractNumber = $"AGR-{contract.CreatedAt:yyyy}-{contract.Id:D4}",
                Terms = contract.Terms,
                ProfitShare = contract.ProfitShare,
                Status = contract.Status.ToString(),
                CreatedAt = contract.CreatedAt,
                ExpiresAt = contract.CreatedAt.AddMonths(Math.Max(contract.Investment.Project.Duration, 1)),
                InvestmentId = contract.InvestmentId,
                ProjectId = contract.Investment.ProjectId,
                InvestorName = contract.Investment.Investor.Name,
                ProjectName = contract.Investment.Project.Name,
                Amount = contract.Investment.Amount,
                TotalAmount = projectInvestments.Sum(i => i.Amount),
                InvestorCount = projectInvestments.Select(i => i.InvestorId).Distinct().Count(),
                Investors = projectInvestments
                    .Select(i => new ProjectInvestorsDto
                    {
                        InvestorId = i.InvestorId,
                        InvestorName = i.Investor?.Name ?? "",
                        Amount = i.Amount,
                        Date = i.Date
                    })
                    .ToList()
            };
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = _http.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        private string? GetCurrentUserRole()
        {
            return _http.HttpContext?.User
                .FindFirst(ClaimTypes.Role)?.Value;
        }
    }
}
