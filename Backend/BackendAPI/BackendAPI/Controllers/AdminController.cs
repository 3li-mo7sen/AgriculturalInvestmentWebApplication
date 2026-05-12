using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _service;

        public AdminController(IAdminService service)
        {
            _service = service;
        }

        // ================= DASHBOARD =================
        // GET /api/Admin/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var data = await _service.GetDashboardAsync();

            return Ok(data);
        }

        // ================= USERS =================
        // GET /api/Admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(
            [FromQuery] string? role,
            [FromQuery] string? status,
            [FromQuery] string? search)
        {
            var users = await _service.GetUsersAsync(role, status, search);

            return Ok(users);
        }

        // ================= GET USER =================
        // GET /api/Admin/users/{id}
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _service.GetUserByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // ================= CREATE USER =================
        // POST /api/Admin/users
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser(AdminCreateUserDto dto)
        {
            var result = await _service.CreateUserAsync(dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= UPDATE USER =================
        // PUT /api/Admin/users/{id}
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateProfileDto dto)
        {
            var result = await _service.UpdateUserAsync(id, dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= UPDATE USER STATUS =================
        // PUT /api/Admin/users/{id}/status
        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, UpdateUserStatusDto dto)
        {
            var result = await _service.UpdateUserStatusAsync(id, dto.Status);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= DELETE USER =================
        // DELETE /api/Admin/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _service.DeleteUserAsync(id);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= PROJECTS =================
        // GET /api/Admin/projects
        [HttpGet("projects")]
        public async Task<IActionResult> GetProjects(
            [FromQuery] string? status,
            [FromQuery] string? crop,
            [FromQuery] string? search)
        {
            var projects = await _service.GetProjectsAsync(status, crop, search);

            return Ok(projects);
        }

        // ================= REPORTS =================
        // GET /api/Admin/reports
        [HttpGet("reports")]
        public async Task<IActionResult> GetReports()
        {
            var reports = await _service.GetReportsAsync();

            return Ok(reports);
        }

        // ================= PLATFORM SETTINGS =================
        // GET /api/Admin/settings
        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _service.GetPlatformSettingsAsync();

            return Ok(settings);
        }

        // ================= UPDATE PLATFORM SETTINGS =================
        // PUT /api/Admin/settings
        [HttpPut("settings")]
        public async Task<IActionResult> UpdateSettings(PlatformSettingsDto dto)
        {
            var settings = await _service.UpdatePlatformSettingsAsync(dto);

            return Ok(settings);
        }
    }
}
