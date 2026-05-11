using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _service;

        public AccountController(IAccountService service)
        {
            _service = service;
        }

        // ================= CURRENT USER =================
        // GET /api/Account/me
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _service.GetCurrentProfileAsync();

            if (user == null)
                return Unauthorized();

            return Ok(user);
        }

        // ================= UPDATE PROFILE =================
        // PUT /api/Account/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var user = await _service.UpdateProfileAsync(dto);

            if (user == null)
                return BadRequest("Cannot update profile");

            return Ok(user);
        }

        // ================= CHANGE PASSWORD =================
        // PUT /api/Account/change-password
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var result = await _service.ChangePasswordAsync(dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= SETTINGS =================
        // GET /api/Account/settings
        [HttpGet("settings")]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _service.GetSettingsAsync();

            return Ok(settings);
        }

        // ================= UPDATE SETTINGS =================
        // PUT /api/Account/settings
        [HttpPut("settings")]
        public async Task<IActionResult> UpdateSettings(AccountSettingsDto dto)
        {
            var settings = await _service.UpdateSettingsAsync(dto);

            return Ok(settings);
        }
    }
}
