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
    }
}