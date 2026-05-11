using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Helpers;
using BackendAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;
        private readonly AppDbContext _context;  

        public AuthController(AuthService auth, AppDbContext context)
        {
            _auth = auth;
            _context = context;
        }

        // ================= LOGIN =================
        // POST /api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _auth.LoginAsync(dto);

            if (result.StartsWith("please"))
            {
                return BadRequest(new ResponseAPI(400, result));
            }

            Response.Cookies.Append("token", result, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,              // devonly
                SameSite = SameSiteMode.Lax, //devonly 
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(1)
            });
            return Ok(new
            {
                statusCode = 200,
                token = result
            });
        }

        // ================= REGISTER FARMER =================
        // POST /api/Auth/register/farmer
        [HttpPost("register/farmer")]
        public async Task<IActionResult> RegisterFarmer(FarmerRegisterDto dto)
        {
            var result = await _auth.RegisterFarmerAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }

        // ================= REGISTER INVESTOR =================
        // POST /api/Auth/register/investor
        [HttpPost("register/investor")]
        public async Task<IActionResult> RegisterInvestor(InvestorRegisterDto dto)
        {
            var result = await _auth.RegisterInvestorAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }

        // ================= REGISTER EXPERT =================
        // POST /api/Auth/register/expert
        [HttpPost("register/expert")]
        public async Task<IActionResult> RegisterExpert(ExpertRegisterDto dto)
        {
            var result = await _auth.RegisterExpertAsync(dto);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }

        //================Active account=======================
        // Get /api/Auth/active
        [HttpGet("active")]
        public async Task<ActionResult<ActiveAccountDTO>> active([FromQuery]ActiveAccountDTO accountDTO)
        {
            var result = await _auth.ActiveAccount(accountDTO);
            return result ? Ok(new{success = true, message = "Email activated successfully"}) : BadRequest(new{success = false, message = "Failed to activate email"});
        }

        //================Delete user by email=======================
        // DELETE /api/Auth/delete-by-email
        [HttpDelete("delete-by-email")]
        public async Task<IActionResult> DeleteUserByEmail(string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return NotFound("User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("User deleted successfully");
        }

        //================Send email for forget password=======================
        // GET /api/Auth/forget-password
        [HttpGet("forget-password")]
        public async Task<IActionResult> forget(string email)
        {
            var result = await _auth.SendEmailForForgetPassword(email);
            return result ? Ok(new ResponseAPI(200, "Email sent successfully")) : BadRequest(new ResponseAPI(404, "Failed to send email"));
        }

        //================Reset password=======================
        // POST /api/Auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> Reset([FromBody] RestPasswordDTO dto)
        {
            var result = await _auth.ResetPassword(dto);

            if (result == "done") return Ok(new ResponseAPI(200, "Password reset successfully"));

            return BadRequest(new ResponseAPI(400, result));
        }

        //=======================For return current user info=======================
        // GET /api/Auth/me
        [Authorize]
        [HttpGet("User-Info")]
        public IActionResult Me()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value;

            return Ok(new
            {
                name,
                email,
                role
            });
        }
    }
}