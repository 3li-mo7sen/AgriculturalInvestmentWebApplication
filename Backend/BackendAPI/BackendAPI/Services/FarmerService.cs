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

        // ======================== DASHBOARD SUMMARY METRICS ========================
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

        // ======================== WALLET LEDGER TRACKING ========================
        public async Task<WalletDto> GetWalletAsync()
        {
            var farmerId = GetCurrentUserId();
            if (farmerId == null) return new WalletDto();

            var farmer = await _context.Farmers
                .FirstOrDefaultAsync(f => f.Id == farmerId.Value);

            if (farmer == null) return new WalletDto();

            // Using your existing SystemTransactions infrastructure safely linked to UserId
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
                Balance = farmer.Balance,
                TotalRaised = totalRaised,
                Transactions = historyTransactions.Select(t => new WalletTransactionDto
                {
                    Id = t.Id,
                    Type = t.Type.ToString().ToLower(), // e.g. "deposit", "withdrawal", "payout"
                    Description = t.Description,
                    Amount = t.Amount,
                    Date = t.Timestamp,
                    Status = "completed"
                }).ToList()
            };
        }

        // ======================== LEGAL CONTRACTS LISTING ========================
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

        // ======================== NEW: NOTIFICATIONS OPERATIONS ========================

        // 1. Fetch current Farmer notifications list
        public async Task<List<NotificationDto>> GetNotificationsAsync()
        {
            var farmerId = GetCurrentUserId();
            if (farmerId == null) return new List<NotificationDto>();

            var notifications = await _context.Notifications
                .Where(n => n.UserId == farmerId.Value)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type.ToLower(), // "success", "info", "danger", etc.
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        // 2. Utility method used anywhere in the backend to push a notification card to this farmer
        public async Task CreateNotificationAsync(int userId, string title, string message, string type)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        // 3. Simple action trigger for when a farmer clicks/clears notifications on the frontend topbar
        public async Task<bool> MarkAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        // ======================== CONTEXT CLAIMS HELPER ========================
        private int? GetCurrentUserId()
        {
            var userIdClaim = _http.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}