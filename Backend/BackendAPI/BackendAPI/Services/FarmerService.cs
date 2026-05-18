// File: BackendAPI/Services/FarmerService.cs
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
    public class FarmerService : IFarmerService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _http;

        public FarmerService(AppDbContext context, IHttpContextAccessor http)
        {
            _context = context;
            _http = http;
        }

        public async Task<RoleDashboardDto> GetDashboardAsync()
        {
            var farmerId = GetCurrentUserId();
            if (farmerId == null) return new RoleDashboardDto();

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

        public async Task<WalletDto> GetWalletAsync()
        {
            var farmerId = GetCurrentUserId();
            if (farmerId == null) return new WalletDto();

            var farmer = await _context.Farmers
                .FirstOrDefaultAsync(f => f.Id == farmerId.Value);

            if (farmer == null) return new WalletDto();

            var historyTransactions = await _context.SystemTransactions
                .Where(t => t.UserId == farmerId.Value)
                .OrderByDescending(t => t.Timestamp)
                .ToListAsync();

            var projects = await _context.Projects
                .Include(p => p.Investments)
                .Where(p => p.FarmerId == farmerId.Value)
                .ToListAsync();

            var totalRaised = projects.Sum(p => p.Investments.Sum(i => i.Amount));

            return new WalletDto
            {
                Balance = farmer.Balance, // Clean real-time tracking value mapping accurately
                TotalRaised = totalRaised,
                Transactions = historyTransactions.Select(t => new WalletTransactionDto
                {
                    Id = t.Id,
                    Type = t.Type.ToString().ToLower(),
                    Description = t.Description,
                    Amount = t.Amount,
                    Date = t.Timestamp,
                    Status = "completed"
                }).ToList()
            };
        }

        public async Task<List<ContractDto>> GetContractsAsync()
        {
            var farmerId = GetCurrentUserId();
            if (farmerId == null) return new List<ContractDto>();

            var contracts = await _context.Contracts
                .Include(c => c.Investment).ThenInclude(i => i.Investor)
                .Include(c => c.Investment).ThenInclude(i => i.Project)
                    .ThenInclude(p => p.Investments)
                .Where(c => c.Investment.Project.FarmerId == farmerId.Value)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return contracts.Select(c => new ContractDto
            {
                Id = c.Id,
                ContractNumber = $"AGR-{c.CreatedAt:yyyy}-{c.Id:D4}",
                Terms = c.Terms,
                ProfitShare = c.ProfitShare,
                Status = c.Status.ToString(),
                CreatedAt = c.CreatedAt,
                ExpiresAt = c.CreatedAt.AddMonths(Math.Max(c.Investment.Project.Duration, 1)),
                InvestmentId = c.InvestmentId,
                ProjectId = c.Investment.ProjectId,
                InvestorName = c.Investment.Investor.Name,
                ProjectName = c.Investment.Project.Name,
                Amount = c.Investment.Amount,
                TotalAmount = c.Investment.Project.Investments.Sum(i => i.Amount),
                InvestorCount = c.Investment.Project.Investments.Select(i => i.InvestorId).Distinct().Count(),
                Investors = c.Investment.Project.Investments.Select(i => new ProjectInvestorsDto
                {
                    InvestorId = i.InvestorId,
                    InvestorName = i.Investor?.Name ?? "Subscribed Investor",
                    Amount = i.Amount,
                    Date = i.Date
                }).ToList()
            }).ToList();
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = _http.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}