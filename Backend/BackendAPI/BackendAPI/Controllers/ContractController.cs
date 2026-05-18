using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Authorize(Roles = "Farmer,Investor,Admin")]
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
        // GET /api/Contract/Get-All-Contracts
        [HttpGet("Get-All-Contracts")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetContractsAsync();
            return Ok(data);
        }

        // ================= GET MY CONTRACTS =================
        // GET /api/Contract/Get-My-Contracts
        [HttpGet("Get-My-Contracts")]
        public async Task<IActionResult> GetMyContracts()
        {
            var data = await _service.GetMyContractsAsync();
            return Ok(data);
        }

        // ================= GET BY PROJECT =================
        // GET /api/Contract/Get-Contracts-By-Project/{projectId}
        [Authorize(Roles = "Farmer,Admin")]
        [HttpGet("Get-Contracts-By-Project/{projectId}")]
        public async Task<IActionResult> GetByProject(int projectId)
        {
            var data = await _service.GetContractsByProjectAsync(projectId);
            return Ok(data);
        }

        // ================= GET BY ID =================
        // GET /api/Contract/Get-Contract-By-Id/{id}
        [HttpGet("Get-Contract-By-Id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetContractByIdAsync(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // ================= UPDATE STATUS =================
        // PUT /api/Contract/Update-Contract-Status/{id}
        [Authorize(Roles = "Farmer,Admin")]
        [HttpPut("Update-Contract-Status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var result = await _service.UpdateContractStatusAsync(id, status);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= CALCULATE PROFIT =================
        // GET /api/Contract/Calculate-Profit/{investmentId}
        [HttpGet("Calculate-Profit/{investmentId}")]
        public async Task<IActionResult> CalculateProfit(int investmentId)
        {
            var result = await _service.CalculateProfitAsync(investmentId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // ================= DISTRIBUTE PROFIT =================
        // POST /api/Contract/Distribute-Profit/{investmentId}
        [Authorize(Roles = "Farmer,Admin")]
        [HttpPost("Distribute-Profit/{investmentId}")]
        public async Task<IActionResult> DistributeProfit(int investmentId)
        {
            var result = await _service.DistributeProfitAsync(investmentId);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
