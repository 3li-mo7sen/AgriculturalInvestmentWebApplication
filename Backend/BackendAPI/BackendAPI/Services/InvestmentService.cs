// File: BackendAPI/Services/InvestmentService.cs
using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        public async Task<ServiceResult> InvestAsync(InvestDto dto)
        {
            if (dto.Amount <= 0)
                return new ServiceResult { Success = false, Message = "Investment validation failure: Amount must be positive." };

            var investorId = GetCurrentUserId();
            if (investorId == null)
                return new ServiceResult { Success = false, Message = "Access Denied: Unverified Authentication Token." };

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Lock rows for update to protect against rapid multi-click concurrency errors
                var investor = await _context.Investors
                    .FromSqlRaw("SELECT * FROM Investors WITH (UPDLOCK) WHERE Id = {0}", investorId.Value)
                    .FirstOrDefaultAsync();

                if (investor == null)
                    return new ServiceResult { Success = false, Message = "Entity Error: Investor profile not found." };

                var project = await _context.Projects
                    .Include(p => p.Investments)
                    .Include(p => p.Farmer)
                    .FirstOrDefaultAsync(p => p.Id == dto.ProjectId);

                if (project == null)
                    return new ServiceResult { Success = false, Message = "Entity Error: Project targeted for investment does not exist." };

                if (project.Status != ProjectStatus.Published)
                    return new ServiceResult { Success = false, Message = "Workflow Exception: Target asset is not currently accepting capital funding contributions." };

                if (dto.Amount < project.MinimumInvestment)
                    return new ServiceResult { Success = false, Message = $"Validation Exception: Minimum transaction floor criteria is EGP {project.MinimumInvestment:N0}." };

                var raised = project.Investments?.Sum(i => i.Amount) ?? 0;
                var remaining = project.Cost - raised;

                if (remaining <= 0)
                    return new ServiceResult { Success = false, Message = "Allocation Overrun: This project is already fully funded." };

                if (dto.Amount > remaining)
                    return new ServiceResult { Success = false, Message = $"Allocation Overrun: Maximum available funding remaining is EGP {remaining:N0}." };

                if (investor.Balance < dto.Amount)
                    return new ServiceResult { Success = false, Message = "Financial Guardrail: Insufficient wallet balance to complete transaction." };

                // Calculate proportional share: (Investment / Total Cost) * (Investor Pool Allotment / 100)
                decimal proportionalAllotmentFactor = (decimal)project.InvestorProfitShare / 100m;
                decimal individualStakingRatio = dto.Amount / project.Cost;
                decimal finalizedContractProfitShare = individualStakingRatio * proportionalAllotmentFactor;

                var investment = new Investment
                {
                    InvestorId = investor.Id,
                    ProjectId = project.Id,
                    Amount = dto.Amount,
                    Date = DateTime.UtcNow
                };
                await _context.Investments.AddAsync(investment);
                await _context.SaveChangesAsync(); // Generates tracking identity references

                var contract = new Contract
                {
                    InvestmentId = investment.Id,
                    Terms = $"Automated Legal Binding Instrument: Allocation of EGP {dto.Amount:N2} out of aggregate operational project cost target EGP {project.Cost:N2} under dynamic calculated yield return share ratio of {finalizedContractProfitShare * 100m:N4}%.",
                    ProfitShare = finalizedContractProfitShare,
                    Status = ContractStatus.Active, // Auto-activates once funding transaction clears
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Contracts.AddAsync(contract);

                // Balance Updates
                investor.Balance -= dto.Amount;
                project.Farmer.Balance += dto.Amount; // Injects capital securely into target escrow account balance

                // Maintain System Audit Trail Ledgers
                var investorTransaction = new SystemTransaction
                {
                    UserId = investor.Id,
                    Type = TransactionType.Investment,
                    Amount = -dto.Amount,
                    Timestamp = DateTime.UtcNow,
                    Description = $"Capital investment executed cleanly against asset portfolio: {project.Name}",
                    ProjectId = project.Id
                };

                var farmerTransaction = new SystemTransaction
                {
                    UserId = project.FarmerId,
                    Type = TransactionType.FundingReceived,
                    Amount = dto.Amount,
                    Timestamp = DateTime.UtcNow,
                    Description = $"Crowdfunded investment capital received successfully for deployment in project: {project.Name}",
                    ProjectId = project.Id
                };

                await _context.SystemTransactions.AddAsync(investorTransaction);
                await _context.SystemTransactions.AddAsync(farmerTransaction);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new ServiceResult { Success = true, Message = "Transaction Complete: Capital investment successfully recorded and deployed." };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ServiceResult { Success = false, Message = $"System Execution Failure: {ex.Message}" };
            }
        }

        public async Task<List<InvestmentViewDto>> GetAllAsync()
        {
            var investments = await GetInvestmentQuery().ToListAsync();
            return investments.Select(MapInvestment).ToList();
        }

        public async Task<InvestmentViewDto?> GetByIdAsync(int id)
        {
            var investment = await GetInvestmentQuery().FirstOrDefaultAsync(i => i.Id == id);
            return investment == null ? null : MapInvestment(investment);
        }

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

        public async Task<List<InvestmentViewDto>> GetMyInvestmentsAsync() => await GetByInvestorAsync(0);

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

        public async Task<List<WalletTransactionDto>> GetMyHistoryAsync()
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null) return new List<WalletTransactionDto>();

            return await _context.SystemTransactions
                .Where(t => t.UserId == currentUserId.Value)
                .OrderByDescending(t => t.Timestamp)
                .Select(t => new WalletTransactionDto
                {
                    Id = t.Id,
                    Type = t.Type.ToString().ToLower(),
                    Description = t.Description,
                    Amount = t.Amount,
                    Date = t.Timestamp,
                    Status = "completed"
                })
                .ToListAsync();
        }

        public async Task<List<ContractDto>> GetContractsAsync()
        {
            var contracts = await GetContractQuery().ToListAsync();
            return contracts.Select(MapContract).ToList();
        }

        public async Task<List<ContractDto>> GetMyContractsAsync()
        {
            var currentUserId = GetCurrentUserId();
            var role = GetCurrentUserRole();

            if (currentUserId == null) return new List<ContractDto>();

            var query = GetContractQuery();

            if (role == "Farmer")
                query = query.Where(c => c.Investment.Project.FarmerId == currentUserId.Value);
            else if (role == "Investor")
                query = query.Where(c => c.Investment.InvestorId == currentUserId.Value);

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
            var contract = await GetContractQuery().FirstOrDefaultAsync(c => c.Id == id);
            return contract == null ? null : MapContract(contract);
        }

        public async Task<ServiceResult> UpdateContractStatusAsync(int id, string status)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return new ServiceResult { Success = false, Message = "Contract identity mismatch context error." };

            if (!Enum.TryParse<ContractStatus>(status, true, out var newStatus))
                return new ServiceResult { Success = false, Message = "Parsing Error: Invalid status argument supplied." };

            contract.Status = newStatus;
            await _context.SaveChangesAsync();

            return new ServiceResult { Success = true, Message = "Legal instruments lifecycle structural status updated successfully." };
        }

        public async Task<ProfitDto?> CalculateProfitAsync(int investmentId)
        {
            var investment = await _context.Investments
                .Include(i => i.Project)
                .Include(i => i.Contract)
                .FirstOrDefaultAsync(i => i.Id == investmentId);

            if (investment == null) return null;
            if (investment.Contract == null) return null;

            if (investment.Contract.Status != ContractStatus.Active)
            {
                return new ProfitDto
                {
                    InvestmentId = investment.Id,
                    InvestedAmount = investment.Amount,
                    ExpectedProfit = 0,
                    InvestorProfit = 0,
                    ProjectName = investment.Project.Name,
                    Status = $"Calculated Blocked: Contract context state is currently: {investment.Contract.Status}"
                };
            }

            var expectedProfitPool = investment.Project.ExpectedProfit;
            var investorShareRatio = investment.Contract.ProfitShare;
            var investorProfit = expectedProfitPool * investorShareRatio;

            return new ProfitDto
            {
                InvestmentId = investment.Id,
                InvestedAmount = investment.Amount,
                ExpectedProfit = expectedProfitPool,
                InvestorProfit = investorProfit,
                ProjectName = investment.Project.Name,
                Status = "Active"
            };
        }

        public async Task<ServiceResult> DistributeProfitAsync(int investmentId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var investment = await _context.Investments
                    .Include(i => i.Project)
                    .Include(i => i.Contract)
                    .Include(i => i.Investor)
                    .FirstOrDefaultAsync(i => i.Id == investmentId);

                if (investment == null) return new ServiceResult { Success = false, Message = "Target asset context could not be located." };
                if (investment.Contract == null) return new ServiceResult { Success = false, Message = "Legal configuration error: Associated binding contract is missing." };

                if (investment.Contract.Status != ContractStatus.Active)
                    return new ServiceResult { Success = false, Message = "Execution Halt: Yield cannot be calculated against an inactive contract status." };

                var expectedProfitPool = investment.Project.ExpectedProfit;
                var investorShareRatio = investment.Contract.ProfitShare;
                var investorProfit = expectedProfitPool * investorShareRatio;

                investment.Investor.Balance += investorProfit;
                investment.Contract.Status = ContractStatus.Completed;

                var performanceRecord = new SystemTransaction
                {
                    UserId = investment.InvestorId,
                    Type = TransactionType.ProfitDistribution,
                    Amount = investorProfit,
                    Timestamp = DateTime.UtcNow,
                    Description = $"Divident payout distribution captured successfully for project asset: {investment.Project.Name}",
                    ProjectId = investment.ProjectId
                };
                await _context.SystemTransactions.AddAsync(performanceRecord);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new ServiceResult { Success = true, Message = $"Yield Distribution Success: EGP {investorProfit:N2} assigned safely." };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ServiceResult { Success = false, Message = $"Distribution processing rolled back down: {ex.Message}" };
            }
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
                .Include(c => c.Investment).ThenInclude(i => i.Project).ThenInclude(p => p.Investments);
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
                Investors = projectInvestments.Select(i => new ProjectInvestorsDto
                {
                    InvestorId = i.InvestorId,
                    InvestorName = i.Investor?.Name ?? "Subscribed Investor",
                    Amount = i.Amount,
                    Date = i.Date
                }).ToList()
            };
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = _http.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        private string? GetCurrentUserRole()
        {
            return _http.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value;
        }
    }
}