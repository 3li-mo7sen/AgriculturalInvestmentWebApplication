// File: BackendAPI/Controllers/ProjectController.cs
using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BackendAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _service;

        public ProjectController(IProjectService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet("Get-All-Projects")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [AllowAnonymous]
        [HttpGet("Get-Project-By-Id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _service.GetByIdAsync(id);
            if (project == null) return NotFound(new { Message = "Asset structural context missing matching criteria identifiers." });
            return Ok(project);
        }

        [AllowAnonymous]
        [HttpGet("Get-Published-Projects")]
        public async Task<IActionResult> GetPublishedProjects()
        {
            return Ok(await _service.GetPublishedProjectsAsync());
        }

        [HttpGet("Get-Projects-By-Status/{status}")]
        public async Task<IActionResult> GetByStatus(string status)
        {
            return Ok(await _service.GetByStatusAsync(status));
        }

        [Authorize(Roles = "Farmer")]
        [HttpPost("Create-Project")]
        public async Task<IActionResult> Create([FromForm] CreateProjectDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (farmerIdClaim == null) return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);
            return Ok(await _service.CreateAsync(dto, farmerId));
        }

        [Authorize(Roles = "Farmer")]
        [HttpGet("Get-My-Projects")]
        public async Task<IActionResult> GetMyProjects()
        {
            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (farmerIdClaim == null) return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);
            return Ok(await _service.GetMyProjectsAsync(farmerId));
        }

        [Authorize(Roles = "Farmer")]
        [HttpPut("Update-Project/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CreateProjectDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (farmerIdClaim == null) return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);
            var updatedProject = await _service.UpdateAsync(id, dto, farmerId);

            if (updatedProject == null) return NotFound(new { Message = "Project mutation targets unreachable or access forbidden." });
            return Ok(updatedProject);
        }

        [Authorize(Roles = "Farmer")]
        [HttpDelete("Delete-Project/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (farmerIdClaim == null) return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);
            bool deleted = await _service.DeleteAsync(id, farmerId);

            if (!deleted) return BadRequest(new { Message = "Destruction Guardrail: Assets out of 'Pending' or 'Rejected' phases cannot be dropped natively." });
            return Ok(new { Message = "Project configuration matrix deleted successfully." });
        }

        [Authorize(Roles = "Expert,Admin")]
        [HttpGet("Get-Pending-Projects")]
        public async Task<IActionResult> GetPendingProjects()
        {
            return Ok(await _service.GetPendingProjectsAsync());
        }

        [Authorize(Roles = "Expert,Admin")]
        [HttpGet("Get-Approved-Projects")]
        public async Task<IActionResult> GetApprovedProjects()
        {
            return Ok(await _service.GetApprovedProjectsAsync());
        }

        [Authorize(Roles = "Expert,Admin")]
        [HttpGet("Get-Rejected-Projects")]
        public async Task<IActionResult> GetRejectedProjects()
        {
            return Ok(await _service.GetRejectedProjectsAsync());
        }

        [Authorize(Roles = "Expert,Admin")]
        [HttpPut("Approve-Project/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            bool approved = await _service.ApproveProjectAsync(id);
            if (!approved) return BadRequest(new { Message = "Asset workflow modification transition blocked." });
            return Ok(new { Message = "Project technical details approved successfully." });
        }

        [Authorize(Roles = "Expert,Admin")]
        [HttpPut("Reject-Project/{id}")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectProjectDto dto)
        {
            bool rejected = await _service.RejectProjectWithReasonAsync(id, dto.Reason);
            if (!rejected) return BadRequest(new { Message = "Asset workflow modification transition blocked." });
            return Ok(new { Message = "Project flagged as rejected with feedback logs preserved." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Publish-Project/{id}")]
        public async Task<IActionResult> Publish(int id)
        {
            bool published = await _service.PublishProjectAsync(id);
            if (!published) return BadRequest(new { Message = "Asset visibility publication transition blocked: Ensure project state balances 'Approved'." });
            return Ok(new { Message = "Asset unlocked and deployed for public crowdfunding investment rounds." });
        }
    }
}