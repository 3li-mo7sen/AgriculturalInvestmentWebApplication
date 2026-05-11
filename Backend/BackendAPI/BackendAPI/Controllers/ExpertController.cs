using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Authorize(Roles = "Expert")]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpertController : ControllerBase
    {
        private readonly IExpertService _service;

        public ExpertController(IExpertService service)
        {
            _service = service;
        }

        // ================= DASHBOARD =================
        // GET /api/Expert/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var data = await _service.GetDashboardAsync();

            return Ok(data);
        }

        // ================= PENDING PROJECTS =================
        // GET /api/Expert/pending-projects
        [HttpGet("pending-projects")]
        public async Task<IActionResult> GetPendingProjects()
        {
            var projects = await _service.GetPendingProjectsAsync();

            return Ok(projects);
        }

        // ================= VERIFIED PROJECTS =================
        // GET /api/Expert/verified-projects
        [HttpGet("verified-projects")]
        public async Task<IActionResult> GetVerifiedProjects()
        {
            var projects = await _service.GetVerifiedProjectsAsync();

            return Ok(projects);
        }

        // ================= REJECTED PROJECTS =================
        // GET /api/Expert/rejected-projects
        [HttpGet("rejected-projects")]
        public async Task<IActionResult> GetRejectedProjects()
        {
            var projects = await _service.GetRejectedProjectsAsync();

            return Ok(projects);
        }

        // ================= VERIFY =================
        // PUT /api/Expert/projects/{id}/verify
        [HttpPut("projects/{id}/verify")]
        public async Task<IActionResult> VerifyProject(int id)
        {
            var result = await _service.VerifyProjectAsync(id);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= REJECT =================
        // PUT /api/Expert/projects/{id}/reject
        [HttpPut("projects/{id}/reject")]
        public async Task<IActionResult> RejectProject(int id, ProjectReviewDto dto)
        {
            var result = await _service.RejectProjectAsync(id, dto.Reason);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
