using BackendAPI.DTOs;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Roles = "Admin")]
        [HttpGet("Get-All-Investors")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        // ================= GET BY ID =================
        // GET /api/Investor/{id}
        [Authorize(Roles = "Admin,Investor")]
        [HttpGet("Get-Investor-By-Id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var investor = await _service.GetByIdAsync(id);

            if (investor == null)
                return NotFound();

            return Ok(investor);
        }

        // ================= DASHBOARD =================
        // GET /api/Investor/dashboard
        [Authorize(Roles = "Investor")]
        [HttpGet("Get-Investor-Dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var data = await _service.GetDashboardAsync();

            return Ok(data);
        }

        // ================= WALLET =================
        // GET /api/Investor/wallet
        [Authorize(Roles = "Investor")]
        [HttpGet("Get-Investor-Wallet")]
        public async Task<IActionResult> GetWallet()
        {
            var wallet = await _service.GetWalletAsync();

            if (wallet == null)
                return NotFound();

            return Ok(wallet);
        }

        // ================= DEPOSIT =================
        // POST /api/Investor/wallet/deposit
        [Authorize(Roles = "Investor")]
        [HttpPost("Wallet/Deposit")]
        public async Task<IActionResult> Deposit(WalletActionDto dto)
        {
            var result = await _service.DepositAsync(dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        // ================= WITHDRAW =================
        // POST /api/Investor/wallet/withdraw
        [Authorize(Roles = "Investor")]
        [HttpPost("Wallet/Withdraw")]
        public async Task<IActionResult> Withdraw(WalletActionDto dto)
        {
            var result = await _service.WithdrawAsync(dto);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
