using BackendAPI.DTOs;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestmentController : ControllerBase
    {
        private readonly IInvestmentService _service;

        public InvestmentController(IInvestmentService service)
        {
            _service = service;
        }

        // POST /api/Investment
        [HttpPost]
        public async Task<IActionResult> Invest([FromBody] InvestDto dto)
        {
            var result = await _service.InvestAsync(dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/Investment
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        // GET /api/Investment/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // GET /api/Investment/by-investor/{investorId}
        [HttpGet("by-investor/{investorId}")]
        public async Task<IActionResult> GetByInvestor(int investorId)
        {
            var data = await _service.GetByInvestorAsync(investorId);
            return Ok(data);
        }

        // GET /api/Investment/by-project/{projectId}
        [HttpGet("by-project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var data = await _service.GetProjectInvestorsAsync(projectId);
            return Ok(data);
        }
    }
}