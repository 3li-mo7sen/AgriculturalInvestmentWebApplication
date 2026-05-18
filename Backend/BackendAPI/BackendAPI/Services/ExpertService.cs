// File: BackendAPI/Services/ExpertService.cs
using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendAPI.Services
{
    public class ExpertService : IExpertService
    {
        private readonly AppDbContext _context;
        private readonly IProjectService _projectService;

        public ExpertService(AppDbContext context, IProjectService projectService)
        {
            _context = context;
            _projectService = projectService;
        }

        public async Task<RoleDashboardDto> GetDashboardAsync()
        {
            var pending = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Pending);
            var verified = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Approved || p.Status == ProjectStatus.Published);
            var rejected = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Rejected);

            var pendingProjects = await _context.Projects
                .Include(p => p.Farmer)
                .Where(p => p.Status == ProjectStatus.Pending)
                .OrderByDescending(p => p.Id)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    ProjectTitle = p.Name,
                    Farmer = p.Farmer.Name,
                    Location = p.Farmer.LandDetails,
                    FundingGoal = p.Cost,
                    ExpectedRoi = p.Cost > 0 ? $"{Math.Round((p.ExpectedProfit / p.Cost) * 100)}%" : "0%"
                }).ToListAsync();

            var recentlyVerified = await _context.Projects
                .Include(p => p.Farmer)
                .Where(p => p.Status == ProjectStatus.Approved || p.Status == ProjectStatus.Published)
                .OrderByDescending(p => p.Id)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    ProjectTitle = p.Name,
                    Farmer = p.Farmer.Name,
                    Location = p.Farmer.LandDetails,
                    Status = p.Status.ToString()
                }).ToListAsync();

            return new RoleDashboardDto
            {
                Stats = new List<DashboardStatDto>
                {
                    new DashboardStatDto { Title = "Pending Reviews", Value = pending.ToString() },
                    new DashboardStatDto { Title = "Verified Projects", Value = verified.ToString() },
                    new DashboardStatDto { Title = "Rejected Projects", Value = rejected.ToString() },
                    new DashboardStatDto { Title = "Total Reviews", Value = (verified + rejected).ToString() }
                },
                RecentItems = pendingProjects,
                Extra = new { RecentlyVerified = recentlyVerified }
            };
        }

        public async Task<List<ProjectDto>> GetPendingProjectsAsync() => await _projectService.GetPendingProjectsAsync();

        public async Task<List<ProjectDto>> GetVerifiedProjectsAsync()
        {
            var approved = await _projectService.GetApprovedProjectsAsync();
            var published = await _projectService.GetPublishedProjectsAsync();
            return approved.Concat(published).OrderByDescending(p => p.Id).ToList();
        }

        public async Task<List<ProjectDto>> GetRejectedProjectsAsync() => await _projectService.GetRejectedProjectsAsync();

        public async Task<ServiceResult> VerifyProjectAsync(int id)
        {
            var approved = await _projectService.ApproveProjectAsync(id);
            return approved
                ? new ServiceResult { Success = true, Message = "Project structure passed technical verification audits cleanly." }
                : new ServiceResult { Success = false, Message = "Verification Exception: Processing restrictions apply to target asset." };
        }

        public async Task<ServiceResult> RejectProjectAsync(int id, string? reason)
        {
            bool rejected = await _projectService.RejectProjectWithReasonAsync(id, reason ?? "Technical documents did not satisfy validation rules criteria.");
            return rejected
                ? new ServiceResult { Success = true, Message = "Asset rejected cleanly and updated context returned back to owner profile." }
                : new ServiceResult { Success = false, Message = "Rejection Failure: Unable to process target project instance state change." };
        }
    }
}