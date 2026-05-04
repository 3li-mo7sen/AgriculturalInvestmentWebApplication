using BackendAPI.DTOs;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

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
}