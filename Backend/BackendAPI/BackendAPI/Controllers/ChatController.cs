using BackendAPI.DTOs;
using BackendAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        // =========================================
        // HELPER
        // =========================================
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return null;

            return int.Parse(userIdClaim);
        }

        // =========================================
        // ACCESS
        // =========================================
        [HttpGet("access")]
        public IActionResult GetChatAccess()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
            {
                return Ok(new
                {
                    mode = "guest"
                });
            }

            return Ok(new
            {
                mode = "personal",
                userId
            });
        }

        // =========================================
        // HISTORY
        // =========================================
        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            var result = await _chatService.GetHistoryAsync(userId.Value);

            return Ok(result);
        }

        // =========================================
        // SEND MESSAGE
        // =========================================
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            var userId = GetCurrentUserId();

            var result = await _chatService.SendMessageAsync(userId, request);

            return Ok(result);
        }

        // =========================================
        // SET PREFERENCE
        // =========================================
        [Authorize]
        [HttpPost("preference")]
        public async Task<IActionResult> SetPreference(bool saveHistory)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            await _chatService.SetPreferenceAsync(userId.Value, saveHistory);

            return Ok(new
            {
                message = "Preference updated successfully"
            });
        }

        // =========================================
        // GET PREFERENCE
        // =========================================
        [Authorize]
        [HttpGet("preference")]
        public async Task<IActionResult> GetPreference()
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            var result = await _chatService.GetPreferenceAsync(userId.Value);

            return Ok(new
            {
                saveHistory = result
            });
        }
    }
}