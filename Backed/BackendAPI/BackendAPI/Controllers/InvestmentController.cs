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

        [HttpPost]
        public async Task<IActionResult> Invest([FromBody] InvestDto dto)
        {
            var result = await _service.InvestAsync(dto);

            if (result != "Investment successful")
                return BadRequest(result);

            return Ok(result);
        }
    }
}