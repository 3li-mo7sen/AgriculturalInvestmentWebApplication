using BackendAPI.Data;
using BackendAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvestorController(AppDbContext context)
        {
            _context = context;
        }

        // ================= GET ALL =================
        // GET /api/Investor
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var investors = await _context.Investors
                .Select(i => new
                {
                    i.Id,
                    i.Name,
                    i.Email,
                    i.Balance
                })
                .ToListAsync();

            return Ok(investors);
        }

        // ================= GET BY ID =================
        // GET /api/Investor/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var investor = await _context.Investors
                .Where(i => i.Id == id)
                .Select(i => new
                {
                    i.Id,
                    i.Name,
                    i.Email,
                    i.Balance
                })
                .FirstOrDefaultAsync();

            if (investor == null)
                return NotFound();

            return Ok(investor);
        }
    }
}