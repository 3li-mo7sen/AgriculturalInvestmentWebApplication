using BackendAPI.DTOs;
using BackendAPI.Interfaces;
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

        // ================= GET ALL =================
        // GET /api/Report
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reports = await _service.GetAllAsync();

            return Ok(reports);
        }

        // ================= GET BY ID =================
        // GET /api/Report/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var report = await _service.GetByIdAsync(id);

            if (report == null)
                return NotFound();

            return Ok(report);
        }

        // ================= GET BY PROJECT =================
        // GET /api/Report/project/1
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var reports = await _service.GetByProjectAsync(projectId);

            return Ok(reports);
        }

        // ================= DELETE =================
        // DELETE /api/Report/1
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return Ok("Report deleted successfully");
        }
    }
}
