using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Authorize(Roles = "Farmer")]
    [ApiController]
    [Route("api/[controller]")]
    public class FarmerController : ControllerBase
    {
        private readonly IFarmerService _service;

        public FarmerController(IFarmerService service)
        {
            _service = service;
        }

        // ================= DASHBOARD =================
        // GET /api/Farmer/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var data = await _service.GetDashboardAsync();

            return Ok(data);
        }

        // ================= WALLET =================
        // GET /api/Farmer/wallet
        [HttpGet("wallet")]
        public async Task<IActionResult> GetWallet()
        {
            var wallet = await _service.GetWalletAsync();

            return Ok(wallet);
        }

        // ================= CONTRACTS =================
        // GET /api/Farmer/contracts
        [HttpGet("contracts")]
        public async Task<IActionResult> GetContracts()
        {
            var contracts = await _service.GetContractsAsync();

            return Ok(contracts);
        }
    }
}
