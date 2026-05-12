using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BackendAPI.Services
{
    public class InvestorService : IInvestorService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _http;

        public InvestorService(AppDbContext context, IHttpContextAccessor http)
        {
            _context = context;
            _http = http;
        }

        // ================= GET ALL =================
        public async Task<List<InvestorDto>> GetAllAsync()
        {
            return await _context.Investors
                .Select(i => new InvestorDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Email,
                    Balance = i.Balance
                })
                .ToListAsync();
        }

        // ================= GET BY ID =================
        public async Task<InvestorDto?> GetByIdAsync(int id)
        {
            return await _context.Investors
                .Where(i => i.Id == id)
                .Select(i => new InvestorDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Email,
                    Balance = i.Balance
                })
                .FirstOrDefaultAsync();
        }

        // ================= DASHBOARD =================
        public async Task<RoleDashboardDto> GetDashboardAsync()
        {
            var investorId = GetCurrentUserId();

            if (investorId == null)
                return new RoleDashboardDto();

            var investor = await _context.Investors
                .Include(i => i.Investments)
                    .ThenInclude(i => i.Project)
                .FirstOrDefaultAsync(i => i.Id == investorId.Value);

            if (investor == null)
                return new RoleDashboardDto();

            var totalInvested = investor.Investments.Sum(i => i.Amount);
            var expectedReturns = investor.Investments.Sum(i => GetExpectedReturn(i));
            var activeInvestments = investor.Investments
                .Count(i => i.Project.Status == ProjectStatus.Published || i.Project.Status == ProjectStatus.Approved);

            var availableProjects = await _context.Projects
                .Where(p => p.Status == ProjectStatus.Published)
                .OrderByDescending(p => p.Id)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    Title = p.Name,
                    TargetAmount = p.Cost,
                    ExpectedRoi = p.Cost > 0 ? $"{Math.Round((p.ExpectedProfit / p.Cost) * 100)}%" : "0%",
                    p.Duration
                })
                .ToListAsync();

            return new RoleDashboardDto
            {
                Stats = new List<DashboardStatDto>
                {
                    new DashboardStatDto { Title = "Wallet Balance", Value = $"EGP {investor.Balance:N0}" },
                    new DashboardStatDto { Title = "Total Invested", Value = $"EGP {totalInvested:N0}" },
                    new DashboardStatDto { Title = "Expected Returns", Value = $"EGP {expectedReturns:N0}" },
                    new DashboardStatDto { Title = "Active Investments", Value = activeInvestments.ToString() }
                },
                RecentItems = investor.Investments
                    .OrderByDescending(i => i.Date)
                    .Take(5)
                    .Select(i => new
                    {
                        i.Id,
                        ProjectTitle = i.Project.Name,
                        InvestedAmount = i.Amount,
                        ExpectedReturn = GetExpectedReturn(i),
                        i.Date
                    })
                    .ToList(),
                Extra = new { AvailableProjects = availableProjects }
            };
        }

        // ================= WALLET =================
        public async Task<WalletDto?> GetWalletAsync()
        {
            var investorId = GetCurrentUserId();

            if (investorId == null)
                return null;

            var investor = await _context.Investors
                .Include(i => i.Investments)
                    .ThenInclude(i => i.Project)
                .Include(i => i.Investments)
                    .ThenInclude(i => i.Contract)
                .FirstOrDefaultAsync(i => i.Id == investorId.Value);

            if (investor == null)
                return null;

            return new WalletDto
            {
                Balance = investor.Balance,
                TotalInvested = investor.Investments.Sum(i => i.Amount),
                TotalReturns = investor.Investments.Sum(i => GetExpectedReturn(i)),
                Transactions = investor.Investments
                    .OrderByDescending(i => i.Date)
                    .Select(i => new WalletTransactionDto
                    {
                        Id = i.Id,
                        Type = "investment",
                        Description = $"Investment in {i.Project.Name}",
                        Amount = -i.Amount,
                        Date = i.Date,
                        Status = i.Contract?.Status.ToString() ?? "Pending",
                        ProjectName = i.Project.Name
                    })
                    .ToList()
            };
        }

        // ================= DEPOSIT =================
        public async Task<ServiceResult> DepositAsync(WalletActionDto dto)
        {
            var investor = await GetCurrentInvestorAsync();

            if (investor == null)
                return new ServiceResult { Success = false, Message = "Investor not found" };

            investor.Balance += dto.Amount;
            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "Deposit completed successfully"
            };
        }

        // ================= WITHDRAW =================
        public async Task<ServiceResult> WithdrawAsync(WalletActionDto dto)
        {
            var investor = await GetCurrentInvestorAsync();

            if (investor == null)
                return new ServiceResult { Success = false, Message = "Investor not found" };

            if (investor.Balance < dto.Amount)
                return new ServiceResult { Success = false, Message = "Insufficient balance" };

            investor.Balance -= dto.Amount;
            await _context.SaveChangesAsync();

            return new ServiceResult
            {
                Success = true,
                Message = "Withdrawal completed successfully"
            };
        }

        private async Task<Investor?> GetCurrentInvestorAsync()
        {
            var investorId = GetCurrentUserId();

            if (investorId == null)
                return null;

            return await _context.Investors
                .FirstOrDefaultAsync(i => i.Id == investorId.Value);
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = _http.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        private static decimal GetExpectedReturn(Investment investment)
        {
            return investment.Project.Cost > 0
                ? investment.Amount * (investment.Project.ExpectedProfit / investment.Project.Cost)
                : 0;
        }
    }
}
