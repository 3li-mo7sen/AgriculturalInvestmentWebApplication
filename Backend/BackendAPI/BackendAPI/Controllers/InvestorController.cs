using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestorController : ControllerBase
    {
        private readonly IInvestorService _service;

        public InvestorController(IInvestorService service)
        {
            _service = service;
        }

        // ================= GET ALL =================
        // GET /api/Investor
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        // ================= GET BY ID =================
        // GET /api/Investor/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var investor = await _service.GetByIdAsync(id);

            if (investor == null)
                return NotFound();

            return Ok(investor);
        }
    }
}