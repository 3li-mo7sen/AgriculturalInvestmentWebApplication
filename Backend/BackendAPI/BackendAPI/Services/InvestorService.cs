// File: BackendAPI/Services/InvestorService.cs
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
    public class InvestorService : IInvestorService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _http;

        public InvestorService(AppDbContext context, IHttpContextAccessor http)
        {
            _context = context;
            _http = http;
        }

        public async Task<List<InvestorDto>> GetAllAsync()
        {
            return await _context.Investors
                .Select(i => new InvestorDto { Id = i.Id, Name = i.Name, Email = i.Email, Balance = i.Balance })
                .ToListAsync();
        }

        public async Task<InvestorDto?> GetByIdAsync(int id)
        {
            return await _context.Investors
                .Where(i => i.Id == id)
                .Select(i => new InvestorDto { Id = i.Id, Name = i.Name, Email = i.Email, Balance = i.Balance })
                .FirstOrDefaultAsync();
        }

        public async Task<RoleDashboardDto> GetDashboardAsync()
        {
            var investorId = GetCurrentUserId();
            if (investorId == null) return new RoleDashboardDto();

            var investor = await _context.Investors
                .Include(i => i.Investments).ThenInclude(i => i.Project)
                .FirstOrDefaultAsync(i => i.Id == investorId.Value);

            if (investor == null) return new RoleDashboardDto();

            var totalInvested = investor.Investments.Sum(i => i.Amount);
            var expectedReturns = investor.Investments.Sum(i => GetExpectedReturn(i));
            var activeInvestments = investor.Investments.Count(i => i.Project.Status == ProjectStatus.Published || i.Project.Status == ProjectStatus.Approved);

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
                    }).ToList(),
                Extra = new { AvailableProjects = availableProjects }
            };
        }

        public async Task<WalletDto?> GetWalletAsync()
        {
            var investorId = GetCurrentUserId();
            if (investorId == null) return null;

            var investor = await _context.Investors
                .Include(i => i.Investments).ThenInclude(i => i.Project)
                .FirstOrDefaultAsync(i => i.Id == investorId.Value);

            if (investor == null) return null;

            var historicalLedger = await _context.SystemTransactions
                .Where(t => t.UserId == investorId.Value)
                .OrderByDescending(t => t.Timestamp)
                .ToListAsync();

            return new WalletDto
            {
                Balance = investor.Balance,
                TotalInvested = investor.Investments.Sum(i => i.Amount),
                TotalReturns = investor.Investments.Sum(i => GetExpectedReturn(i)),
                Transactions = historicalLedger.Select(t => new WalletTransactionDto
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

        public async Task<ServiceResult> DepositAsync(WalletActionDto dto)
        {
            if (dto.Amount <= 0) return new ServiceResult { Success = false, Message = "Amount must be greater than zero." };
            var investor = await GetCurrentInvestorAsync();
            if (investor == null) return new ServiceResult { Success = false, Message = "Investor identity profile error." };

            investor.Balance += dto.Amount;

            var log = new SystemTransaction
            {
                UserId = investor.Id,
                Type = TransactionType.Deposit,
                Amount = dto.Amount,
                Timestamp = DateTime.UtcNow,
                Description = $"Funds loaded via digital gateway processing channel: EGP {dto.Amount:N2}"
            };
            await _context.SystemTransactions.AddAsync(log);
            await _context.SaveChangesAsync();

            return new ServiceResult { Success = true, Message = "Deposit verified and parsed successfully onto wallet account structure." };
        }

        public async Task<ServiceResult> WithdrawAsync(WalletActionDto dto)
        {
            if (dto.Amount <= 0) return new ServiceResult { Success = false, Message = "Amount must be greater than zero." };
            var investor = await GetCurrentInvestorAsync();
            if (investor == null) return new ServiceResult { Success = false, Message = "Investor identity profile error." };

            if (investor.Balance < dto.Amount)
                return new ServiceResult { Success = false, Message = "Insufficient availability bounds matching request." };

            investor.Balance -= dto.Amount;

            var log = new SystemTransaction
            {
                UserId = investor.Id,
                Type = TransactionType.Withdrawal,
                Amount = -dto.Amount,
                Timestamp = DateTime.UtcNow,
                Description = $"Outbound electronic extraction clearance executed: EGP {dto.Amount:N2}"
            };
            await _context.SystemTransactions.AddAsync(log);
            await _context.SaveChangesAsync();

            return new ServiceResult { Success = true, Message = "Withdrawal request authorized and processed cleanly." };
        }

        private async Task<Investor?> GetCurrentInvestorAsync()
        {
            var investorId = GetCurrentUserId();
            return investorId == null ? null : await _context.Investors.FirstOrDefaultAsync(i => i.Id == investorId.Value);
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = _http.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        private static decimal GetExpectedReturn(Investment investment)
        {
            if (investment.Project == null || investment.Project.Cost == 0) return 0;
            return investment.Amount * (investment.Project.ExpectedProfit / investment.Project.Cost);
        }
    }
}