using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class InvestDto
    {

        [Required]
        public int ProjectId { get; set; }

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }
    }
}
