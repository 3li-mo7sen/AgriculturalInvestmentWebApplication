using BackendAPI.DTOs;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;

        public AuthController(AuthService auth)
        {
            _auth = auth;
        }

        // ================= LOGIN =================
        // POST /api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _auth.LoginAsync(dto);

            if (token == null)
                return Unauthorized("Invalid credentials");

            return Ok(new { token });
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
    }
}