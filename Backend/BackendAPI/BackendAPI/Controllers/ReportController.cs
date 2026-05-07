using BackendAPI.DTOs;
using BackendAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportController(IReportService service)
        {
            _service = service;
        }

        // ================= CREATE =================
        // POST /api/Report
        [Authorize(Roles = "Farmer,Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(ReportDto dto)
        {
            var result = await _service.CreateAsync(dto);

            return Ok(result);
        }

        // ================= GET BY PROJECT =================
        // GET /api/Report/project/1
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var reports = await _service.GetByProjectAsync(projectId);

            return Ok(reports);
        }
    }
}