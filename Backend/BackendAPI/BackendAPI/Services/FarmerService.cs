using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BackendAPI.Services
{
    public class FarmerService : IFarmerService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _http;

        public FarmerService(AppDbContext context, IHttpContextAccessor http)
        {
            _context = context;
            _http = http;
        }

        // ================= DASHBOARD =================
        public async Task<RoleDashboardDto> GetDashboardAsync()
        {
            var farmerId = GetCurrentUserId();

            if (farmerId == null)
                return new RoleDashboardDto();

            var projects = await _context.Projects
                .Include(p => p.Investments)
                .Where(p => p.FarmerId == farmerId.Value)
                .OrderByDescending(p => p.Id)
                .ToListAsync();

            var totalRaised = projects.Sum(p => p.Investments.Sum(i => i.Amount));

            return new RoleDashboardDto
            {
                Stats = new List<DashboardStatDto>
                {
                    new DashboardStatDto { Title = "Total Projects", Value = projects.Count.ToString() },
                    new DashboardStatDto { Title = "Active Projects", Value = projects.Count(p => p.Status == ProjectStatus.Published).ToString() },
                    new DashboardStatDto { Title = "Pending Reviews", Value = projects.Count(p => p.Status == ProjectStatus.Pending).ToString() },
                    new DashboardStatDto { Title = "Total Raised", Value = $"EGP {totalRaised:N0}" }
                },
                RecentItems = projects.Take(5).Select(p => new
                {
                    p.Id,
                    ProjectTitle = p.Name,
                    Status = p.Status.ToString(),
                    FundingRaised = p.Investments.Sum(i => i.Amount),
                    FundingGoal = p.Cost,
                    FundingProgress = p.Cost > 0
                        ? (int)Math.Min(100, Math.Round((p.Investments.Sum(i => i.Amount) / p.Cost) * 100))
                        : 0
                }).ToList()
            };
        }

        // ================= WALLET =================
        public async Task<WalletDto> GetWalletAsync()
        {
            var farmerId = GetCurrentUserId();

            if (farmerId == null)
                return new WalletDto();

            var investments = await _context.Investments
                .Include(i => i.Project)
                .Where(i => i.Project.FarmerId == farmerId.Value)
                .OrderByDescending(i => i.Date)
                .ToListAsync();

            return new WalletDto
            {
                Balance = investments.Sum(i => i.Amount),
                TotalRaised = investments.Sum(i => i.Amount),
                Transactions = investments.Select(i => new WalletTransactionDto
                {
                    Id = i.Id,
                    Type = "funding",
                    Description = $"Funding received for {i.Project.Name}",
                    Amount = i.Amount,
                    Date = i.Date,
                    Status = "completed",
                    ProjectName = i.Project.Name
                }).ToList()
            };
        }

        // ================= CONTRACTS =================
        public async Task<List<ContractDto>> GetContractsAsync()
        {
            var farmerId = GetCurrentUserId();

            if (farmerId == null)
                return new List<ContractDto>();

            var projects = await _context.Projects
                .Include(p => p.Investments)
                    .ThenInclude(i => i.Investor)
                .Include(p => p.Investments)
                    .ThenInclude(i => i.Contract)
                .Where(p => p.FarmerId == farmerId.Value && p.Investments.Any())
                .ToListAsync();

            return projects.Select(MapProjectContract).ToList();
        }

        private static ContractDto MapProjectContract(Project project)
        {
            var firstInvestment = project.Investments.OrderBy(i => i.Date).First();
            var firstContract = firstInvestment.Contract;
            var totalAmount = project.Investments.Sum(i => i.Amount);

            return new ContractDto
            {
                Id = firstContract?.Id ?? firstInvestment.Id,
                ContractNumber = $"AGR-{firstInvestment.Date:yyyy}-{project.Id:D4}",
                Terms = firstContract?.Terms,
                ProfitShare = firstContract?.ProfitShare ?? 0,
                Status = firstContract?.Status.ToString() ?? "Pending",
                CreatedAt = firstContract?.CreatedAt ?? firstInvestment.Date,
                ExpiresAt = (firstContract?.CreatedAt ?? firstInvestment.Date).AddMonths(Math.Max(project.Duration, 1)),
                InvestmentId = firstInvestment.Id,
                ProjectId = project.Id,
                InvestorName = firstInvestment.Investor.Name,
                ProjectName = project.Name,
                Amount = firstInvestment.Amount,
                TotalAmount = totalAmount,
                InvestorCount = project.Investments.Select(i => i.InvestorId).Distinct().Count(),
                Investors = project.Investments.Select(i => new ProjectInvestorsDto
                {
                    InvestorId = i.InvestorId,
                    InvestorName = i.Investor.Name,
                    Amount = i.Amount,
                    Date = i.Date
                }).ToList()
            };
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = _http.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}
