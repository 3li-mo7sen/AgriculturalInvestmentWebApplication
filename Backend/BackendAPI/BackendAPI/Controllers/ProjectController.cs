using BackendAPI.DTOs;
using BackendAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        // ================= GET ALL =================
        // GET /api/Project
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();

            return Ok(data);
        }

        // ================= GET BY ID =================
        // GET /api/Project/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _service.GetByIdAsync(id);

            if (project == null)
                return NotFound();

            return Ok(project);
        }

        // ================= CREATE =================
        // POST /api/Project
        [Authorize(Roles = "Farmer")]
        [HttpPost]
        public async Task<IActionResult> Create(ProjectDto dto)
        {
            // ===== Get Farmer Id From Token =====
            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (farmerIdClaim == null)
                return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);

            var result = await _service.CreateAsync(dto, farmerId);

            return Ok(result);
        }

        // ================= MY PROJECTS =================
        // GET /api/Project/my-projects
        [Authorize(Roles = "Farmer")]
        [HttpGet("my-projects")]
        public async Task<IActionResult> GetMyProjects()
        {
            // ===== Get Farmer Id From Token =====
            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (farmerIdClaim == null)
                return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);

            var projects = await _service.GetMyProjectsAsync(farmerId);

            return Ok(projects);
        }

        // ================= UPDATE =================
        // PUT /api/Project/{id}
        [Authorize(Roles = "Farmer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProjectDto dto)
        {
            // ===== Get Farmer Id From Token =====
            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (farmerIdClaim == null)
                return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);

            var updatedProject = await _service.UpdateAsync(id, dto, farmerId);

            if (updatedProject == null)
                return NotFound();

            return Ok(updatedProject);
        }

        // ================= DELETE =================
        // DELETE /api/Project/{id}
        [Authorize(Roles = "Farmer")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // ===== Get Farmer Id From Token =====
            var farmerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (farmerIdClaim == null)
                return Unauthorized();

            int farmerId = int.Parse(farmerIdClaim.Value);

            var deleted = await _service.DeleteAsync(id, farmerId);

            if (!deleted)
                return BadRequest("Cannot delete this project");

            return Ok("Project deleted successfully");
        }

        // ================= PENDING PROJECTS =================
        // GET /api/Project/pending
        [Authorize(Roles = "Expert")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingProjects()
        {
            var projects = await _service.GetPendingProjectsAsync();

            return Ok(projects);
        }

        // ================= APPROVE =================
        // PUT /api/Project/approve/{id}
        [Authorize(Roles = "Expert")]
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var approved = await _service.ApproveProjectAsync(id);

            if (!approved)
                return BadRequest("Cannot approve this project");

            return Ok("Project approved successfully");
        }

        // ================= REJECT =================
        // PUT /api/Project/reject/{id}
        [Authorize(Roles = "Expert")]
        [HttpPut("reject/{id}")]
        public async Task<IActionResult> Reject(int id)
        {
            var rejected = await _service.RejectProjectAsync(id);

            if (!rejected)
                return BadRequest("Cannot reject this project");

            return Ok("Project rejected successfully");
        }

        // ================= PUBLISH =================
        // PUT /api/Project/publish/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("publish/{id}")]
        public async Task<IActionResult> Publish(int id)
        {
            var published = await _service.PublishProjectAsync(id);

            if (!published)
                return BadRequest("Cannot publish this project");

            return Ok("Project published successfully");
        }
    }
}