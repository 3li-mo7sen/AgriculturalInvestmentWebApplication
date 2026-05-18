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
        // CHANGED: Injected IFarmerService to handle real-time contextual notifications for project state changes
        private readonly IFarmerService _farmerService;

        public ProjectService(AppDbContext context, IFarmerService farmerService)
        {
            _context = context;
            _farmerService = farmerService;
        }

        /// <summary>
        /// Admin/Expert Endpoint: Retrieves all existing agricultural projects across the entire system.
        /// </summary>
        public async Task<List<ProjectDto>> GetAllAsync()
        {
            var projects = await GetProjectQuery().ToListAsync();
            return projects.Select(MapProject).ToList();
        }

        /// <summary>
        /// Global Endpoint: Fetches detailed profile configurations for a single project by its unique ID.
        /// </summary>
        public async Task<ProjectDto?> GetByIdAsync(int id)
        {
            var project = await GetProjectQuery().FirstOrDefaultAsync(p => p.Id == id);
            return project == null ? null : MapProject(project);
        }

        /// <summary>
        /// Filter Endpoint: Looks up list collections of projects targeting specific state queries (e.g., pending, approved).
        /// </summary>
        public async Task<List<ProjectDto>> GetByStatusAsync(string status)
        {
            if (!TryParseProjectStatus(status, out var projectStatus)) return new List<ProjectDto>();

            var projects = await GetProjectQuery().Where(p => p.Status == projectStatus).ToListAsync();
            return projects.Select(MapProject).ToList();
        }

        /// <summary>
        /// Public Marketplace Endpoint: Fetches active, verified projects available for investor funding.
        /// </summary>
        public async Task<List<ProjectDto>> GetPublishedProjectsAsync()
        {
            var projects = await GetProjectQuery().Where(p => p.Status == ProjectStatus.Published).ToListAsync();
            return projects.Select(MapProject).ToList();
        }

        /// <summary>
        /// Farmer Action Workflow: Handles multi-part multi-document text fields and uploads to persist a new project draft.
        /// </summary>
        public async Task<ProjectDto> CreateAsync(CreateProjectDto dto, int farmerId)
        {
            // Process form uploads into relative static storage assets inside wwwroot path
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
                Status = ProjectStatus.Pending, // Default start state requiring expert review
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

            // CHANGED: Push an audit confirmation log directly onto the farmer dashboard instantly on creation
            await _farmerService.CreateNotificationAsync(
                farmerId,
                "Project Submitted Successfully",
                $"Your listing request for '{project.Name}' has been queued for verification processing.",
                "info"
            );

            var createdProject = await GetProjectQuery().FirstAsync(p => p.Id == project.Id);
            return MapProject(createdProject);
        }

        /// <summary>
        /// Dashboard Endpoint: Fetches all listed configurations belonging exclusively to the requesting authenticated farmer.
        /// </summary>
        public async Task<List<ProjectDto>> GetMyProjectsAsync(int farmerId)
        {
            var projects = await GetProjectQuery().Where(p => p.FarmerId == farmerId).ToListAsync();
            return projects.Select(MapProject).ToList();
        }

        /// <summary>
        /// Farmer Action Workflow: Re-evaluates and replaces tracking variables and clears active rejections if corrected.
        /// </summary>
        public async Task<ProjectDto?> UpdateAsync(int id, CreateProjectDto dto, int farmerId)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.FarmerId != farmerId) return null;

            // Handle replacement uploads conditionally only if new stream binaries are provided by frontend forms
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

            // CHANGED: Notify farmer that modification writes successfully synced back onto the database structure
            await _farmerService.CreateNotificationAsync(
                farmerId,
                "Project Updated",
                $"Changes to your project '{project.Name}' have been saved. Status reset to Pending review.",
                "warning"
            );

            var updatedProject = await GetProjectQuery().FirstAsync(p => p.Id == project.Id);
            return MapProject(updatedProject);
        }

        /// <summary>
        /// Farmer Action Workflow: Removes target row record tracking completely if it has not yet processed funding links.
        /// </summary>
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

        /// <summary>
        /// Expert System Action: Verifies documents are accurate, moves state forward, and unlocks publishing access.
        /// </summary>
        public async Task<bool> ApproveProjectAsync(int id)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.Status != ProjectStatus.Pending) return false;

            project.Status = ProjectStatus.Approved;
            project.RejectionReason = null;
            await _context.SaveChangesAsync();

            // CHANGED: Dispatches positive validation confirmation onto the specific farmer tracking context view profile 
            await _farmerService.CreateNotificationAsync(
                project.FarmerId,
                "Project Approved! 🎉",
                $"Your project '{project.Name}' has cleared documentation verification and is ready to publish.",
                "success"
            );

            return true;
        }

        /// <summary>
        /// Expert System Action: Rejects with fallback text if no context reason is sent.
        /// </summary>
        public async Task<bool> RejectProjectAsync(int id) =>
            await RejectProjectWithReasonAsync(id, "No reason provided by verification authority.");

        /// <summary>
        /// Expert System Action: Flags project structure as rejected and logs review feedback reason notes.
        /// </summary>
        public async Task<bool> RejectProjectWithReasonAsync(int id, string reason)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.Status != ProjectStatus.Pending) return false;

            project.Status = ProjectStatus.Rejected;
            project.RejectionReason = reason;
            await _context.SaveChangesAsync();

            // CHANGED: Logs high priority alert directly warning the farmer why verification failed
            await _farmerService.CreateNotificationAsync(
                project.FarmerId,
                "Project Attention Required ⚠️",
                $"Your project '{project.Name}' was rejected. Reason: {reason}",
                "danger"
            );

            return true;
        }

        /// <summary>
        /// Farmer Action Workflow: Publishes approved configurations directly to the public investment stream.
        /// </summary>
        public async Task<bool> PublishProjectAsync(int id)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null || project.Status != ProjectStatus.Approved) return false;

            project.Status = ProjectStatus.Published;
            await _context.SaveChangesAsync();

            // CHANGED: Logs tracking update that item is live to external capital funding lines
            await _farmerService.CreateNotificationAsync(
                project.FarmerId,
                "Project Published Live 🚀",
                $"Investment matching for '{project.Name}' is active. Investors can now fund your project.",
                "success"
            );

            return true;
        }

        /// <summary>
        /// Core Local I/O Utility: Writes physical binary streams into target wwwroot storage layout zones safely.
        /// </summary>
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

        /// <summary>
        /// Query Optimization: Base tracking statement to include related parent farmer profiles and tracking investment entries.
        /// </summary>
        private IQueryable<Project> GetProjectQuery()
        {
            return _context.Projects.Include(p => p.Farmer).Include(p => p.Investments);
        }

        /// <summary>
        /// Explicit Auto-Mapping: Transfers core model values and live computational tracking percentages securely into the DTO layer.
        /// </summary>
        private static ProjectDto MapProject(Project project)
        {
            var fundingRaised = project.Investments?.Sum(i => i.Amount) ?? 0;
            var fundingProgress = project.Cost > 0 ? (int)Math.Min(100, Math.Round((fundingRaised / project.Cost) * 100)) : 0;

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

        /// <summary>
        /// Normalization Utility: Standardizes custom status input string variations back into strict strongly typed backend configurations.
        /// </summary>
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