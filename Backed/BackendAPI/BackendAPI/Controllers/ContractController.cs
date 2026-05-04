using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContractController : ControllerBase
    {
        private readonly IInvestmentService _service;

        public ContractController(IInvestmentService service)
        {
            _service = service;
        }

        // ================= GET ALL =================
        // GET /api/Contract
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetContractsAsync();
            return Ok(data);
        }

        // ================= GET BY ID =================
        // GET /api/Contract/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetContractByIdAsync(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // ================= UPDATE STATUS =================
        // PUT /api/Contract/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var result = await _service.UpdateContractStatusAsync(id, status);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= CALCULATE PROFIT =================
        // GET /api/Contract/{investmentId}/profit
        [HttpGet("{investmentId}/profit")]
        public async Task<IActionResult> CalculateProfit(int investmentId)
        {
            var result = await _service.CalculateProfitAsync(investmentId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // ================= DISTRIBUTE PROFIT =================
        // POST /api/Contract/{investmentId}/distribute
        [HttpPost("{investmentId}/distribute")]
        public async Task<IActionResult> DistributeProfit(int investmentId)
        {
            var result = await _service.DistributeProfitAsync(investmentId);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}