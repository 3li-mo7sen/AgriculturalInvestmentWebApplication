using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Authorize]
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
        [Authorize(Roles = "Investor")]
        [HttpPost]
        public async Task<IActionResult> Invest([FromBody] InvestDto dto)
        {
            var result = await _service.InvestAsync(dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/Investment
        [Authorize(Roles = "Admin,Investor")]
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
        [Authorize(Roles = "Investor,Admin")]
        [HttpGet("by-investor/{investorId}")]
        public async Task<IActionResult> GetByInvestor(int investorId)
        {
            var data = await _service.GetByInvestorAsync(investorId);
            return Ok(data);
        }

        // GET /api/Investment/my-investments
        [Authorize(Roles = "Investor")]
        [HttpGet("my-investments")]
        public async Task<IActionResult> GetMyInvestments()
        {
            var data = await _service.GetMyInvestmentsAsync();
            return Ok(data);
        }

        // GET /api/Investment/history
        [Authorize(Roles = "Investor")]
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var data = await _service.GetMyHistoryAsync();
            return Ok(data);
        }

        // GET /api/Investment/by-project/{projectId}
        [Authorize(Roles = "Farmer,Expert,Admin")]
        [HttpGet("by-project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var data = await _service.GetProjectInvestorsAsync(projectId);
            return Ok(data);
        }
    }
}
