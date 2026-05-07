using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class ProfitDto
    {
        [Required]
        public int ContractId { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TotalProfit { get; set; }
    }
}