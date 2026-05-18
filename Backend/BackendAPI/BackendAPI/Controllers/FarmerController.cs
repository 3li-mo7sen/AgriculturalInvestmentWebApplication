// File: BackendAPI/Controllers/FarmerController.cs
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
        // GET /api/Farmer/Get-Farmer-Dashboard
        [HttpGet("Get-Farmer-Dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            return Ok(await _service.GetDashboardAsync());
        }

        //================== WALLET =================
        // GET /api/Farmer/Get-Farmer-Wallet
        [HttpGet("Get-Farmer-Wallet")]
        public async Task<IActionResult> GetWallet()
        {
            return Ok(await _service.GetWalletAsync());
        }

        // ================= CONTRACTS =================
        // GET /api/Farmer/Get-Farmer-Contracts
        [HttpGet("Get-Farmer-Contracts")]
        public async Task<IActionResult> GetContracts()
        {
            return Ok(await _service.GetContractsAsync());
        }
    }
}