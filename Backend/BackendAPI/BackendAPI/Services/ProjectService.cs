// File: BackendAPI/Services/ProjectService.cs
using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendAPI.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProjectDto>> GetAllAsync()
        {
            var projects = await GetProjectQuery().ToListAsync();
            return projects.Select(MapProject).ToList();
        }

        public async Task<ProjectDto?> GetByIdAsync(int id)
        {
            var project = await GetProjectQuery().FirstOrDefaultAsync(p => p.Id == id);
            return project == null ? null : MapProject(project);
        }

        public async Task<List<ProjectDto>> GetByStatusAsync(string status)
        {
            if (!TryParseProjectStatus(status, out var projectStatus)) return new List<ProjectDto>();

            var projects = await GetProjectQuery().Where(p => p.Status == projectStatus).ToListAsync();

            return projects.Select(MapProject).ToList();
        }

        public async Task<List<ProjectDto>> GetPublishedProjectsAsync()
        {
            var projects = await GetProjectQuery().Where(p => p.Status == ProjectStatus.Published).ToListAsync();

            return projects.Select(MapProject).ToList();
        }

        public async Task<ProjectDto> CreateAsync(CreateProjectDto dto, int farmerId)
        {
            string? imagePath = await SaveFileAsync(dto.Image, "wwwroot/images/projects");
            string? landOwnershipPath = await SaveFileAsync(dto.LandOwnershipDoc, "wwwroot/uploads/documents");
            string? nationalIdPath = await SaveFileAsync(dto.NationalIdDoc, "wwwroot/uploads/documents");
            string? agriculturalPermitPath = await SaveFileAsync(dto.AgriculturalPermitDoc, "wwwroot/uploads/documents");
            string? waterRightsPath = await SaveFileAsync(dto.WaterRightsDoc, "wwwroot/uploads/documents");

            var project = new Project
            {
                Name = dto.Name,
                Cost = dto.Cost,
                ExpectedProfit = dto.ExpectedProfit,
                Duration = dto.Duration,
                FarmerId = farmerId,
                Status = ProjectStatus.Pending,
                ImageUrl = imagePath,
                ShortDescription = dto.ShortDescription,
                FullDescription = dto.FullDescription,
                CropType = dto.CropType,
                Governorate = dto.Governorate,
                District = dto.District,
                LandSize = dto.LandSize,
                SoilType = dto.SoilType,
                WaterSource = dto.WaterSource,
                LandOwnershipType = dto.LandOwnershipType,
                ExpectedCropSeason = dto.ExpectedCropSeason,
                MinimumInvestment = dto.MinimumInvestment,
                FarmerProfitShare = dto.FarmerProfitShare,
                InvestorProfitShare = dto.InvestorProfitShare,
                LandOwnershipDocUrl = landOwnershipPath,
                NationalIdDocUrl = nationalIdPath,
                AgriculturalPermitDocUrl = agriculturalPermitPath,
                WaterRightsDocUrl = waterRightsPath
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var createdProject = await GetProjectQuery().FirstAsync(p => p.Id == project.Id);
            return MapProject(createdProject);
        }

        public async Task<List<ProjectDto>> GetMyProjectsAsync(int farmerId)
        {
            var projects = await GetProjectQuery().Where(p => p.FarmerId == farmerId).ToListAsync();

            return projects.Select(MapProject).ToList();
        }

        public async Task<ProjectDto?> UpdateAsync(int id, CreateProjectDto dto, int farmerId)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.FarmerId != farmerId) return null;

            if (dto.Image != null) project.ImageUrl = await SaveFileAsync(dto.Image, "wwwroot/images/projects");
            if (dto.LandOwnershipDoc != null) project.LandOwnershipDocUrl = await SaveFileAsync(dto.LandOwnershipDoc, "wwwroot/uploads/documents");
            if (dto.NationalIdDoc != null) project.NationalIdDocUrl = await SaveFileAsync(dto.NationalIdDoc, "wwwroot/uploads/documents");
            if (dto.AgriculturalPermitDoc != null) project.AgriculturalPermitDocUrl = await SaveFileAsync(dto.AgriculturalPermitDoc, "wwwroot/uploads/documents");
            if (dto.WaterRightsDoc != null) project.WaterRightsDocUrl = await SaveFileAsync(dto.WaterRightsDoc, "wwwroot/uploads/documents");

            project.Name = dto.Name;
            project.Cost = dto.Cost;
            project.ExpectedProfit = dto.ExpectedProfit;
            project.Duration = dto.Duration;
            project.ShortDescription = dto.ShortDescription;
            project.FullDescription = dto.FullDescription;
            project.CropType = dto.CropType;
            project.Governorate = dto.Governorate;
            project.District = dto.District;
            project.LandSize = dto.LandSize;
            project.SoilType = dto.SoilType;
            project.WaterSource = dto.WaterSource;
            project.LandOwnershipType = dto.LandOwnershipType;
            project.ExpectedCropSeason = dto.ExpectedCropSeason;
            project.MinimumInvestment = dto.MinimumInvestment;
            project.FarmerProfitShare = dto.FarmerProfitShare;
            project.InvestorProfitShare = dto.InvestorProfitShare;

            // Re-evaluating status back down if updated out of a rejection loop state
            if (project.Status == ProjectStatus.Rejected)
            {
                project.Status = ProjectStatus.Pending;
                project.RejectionReason = null;
            }

            await _context.SaveChangesAsync();

            var updatedProject = await GetProjectQuery().FirstAsync(p => p.Id == project.Id);
            return MapProject(updatedProject);
        }

        public async Task<bool> DeleteAsync(int id, int farmerId)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.FarmerId != farmerId || (project.Status != ProjectStatus.Pending && project.Status != ProjectStatus.Rejected))
                return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ProjectDto>> GetPendingProjectsAsync() => await GetByStatusAsync("pending");
        public async Task<List<ProjectDto>> GetApprovedProjectsAsync() => await GetByStatusAsync("approved");
        public async Task<List<ProjectDto>> GetRejectedProjectsAsync() => await GetByStatusAsync("rejected");

        public async Task<bool> ApproveProjectAsync(int id)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.Status != ProjectStatus.Pending) return false;

            project.Status = ProjectStatus.Approved;
            project.RejectionReason = null;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectProjectAsync(int id) => await RejectProjectWithReasonAsync(id, "No reason provided by verification authority.");

        public async Task<bool> RejectProjectWithReasonAsync(int id, string reason)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.Status != ProjectStatus.Pending) return false;

            project.Status = ProjectStatus.Rejected;
            project.RejectionReason = reason;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PublishProjectAsync(int id)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.Status != ProjectStatus.Approved) return false;

            project.Status = ProjectStatus.Published;
            await _context.SaveChangesAsync();
            return true;
        }

        private static async Task<string?> SaveFileAsync(IFormFile? file, string folder)
        {
            if (file == null) return null;

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), folder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            string relativePath = folder.Replace("wwwroot", "");
            return $"{relativePath}/{fileName}";
        }

        private IQueryable<Project> GetProjectQuery()
        {
            return _context.Projects.Include(p => p.Farmer).Include(p => p.Investments);
        }

        private static ProjectDto MapProject(Project project)
        {
            var fundingRaised = project.Investments?.Sum(i => i.Amount) ?? 0;
            var fundingProgress = project.Cost > 0  ? (int)Math.Min(100, Math.Round((fundingRaised / project.Cost) * 100)) : 0;

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Cost = project.Cost,
                FundingRaised = fundingRaised,
                FundingProgress = fundingProgress,
                ExpectedProfit = project.ExpectedProfit,
                Duration = project.Duration,
                FarmerId = project.FarmerId,
                FarmerName = project.Farmer?.Name,
                ImageUrl = project.ImageUrl,
                Status = project.Status.ToString(),
                ShortDescription = project.ShortDescription,
                FullDescription = project.FullDescription,
                CropType = project.CropType,
                Governorate = project.Governorate,
                District = project.District,
                LandSize = project.LandSize,
                SoilType = project.SoilType,
                WaterSource = project.WaterSource,
                LandOwnershipType = project.LandOwnershipType,
                ExpectedCropSeason = project.ExpectedCropSeason,
                MinimumInvestment = project.MinimumInvestment,
                FarmerProfitShare = project.FarmerProfitShare,
                InvestorProfitShare = project.InvestorProfitShare,
                LandOwnershipDocUrl = project.LandOwnershipDocUrl,
                NationalIdDocUrl = project.NationalIdDocUrl,
                AgriculturalPermitDocUrl = project.AgriculturalPermitDocUrl,
                WaterRightsDocUrl = project.WaterRightsDocUrl,
                RejectionReason = project.RejectionReason
            };
        }

        private static bool TryParseProjectStatus(string status, out ProjectStatus projectStatus)
        {
            var normalizedStatus = status.Trim().Replace("-", "_").ToLower();
            projectStatus = normalizedStatus switch
            {
                "pending" => ProjectStatus.Pending,
                "approved" => ProjectStatus.Approved,
                "published" => ProjectStatus.Published,
                "rejected" => ProjectStatus.Rejected,
                _ => default
            };
            return normalizedStatus is "pending" or "approved" or "published" or "rejected";
        }
    }
}