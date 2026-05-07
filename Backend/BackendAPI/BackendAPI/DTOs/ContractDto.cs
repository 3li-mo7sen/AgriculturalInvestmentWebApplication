using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class ContractDto
    {
        public int Id { get; set; }

        [Required]
        public string Terms { get; set; }

        [Range(0, 100)]
        public decimal ProfitShare { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }

        [Required]
        public int InvestmentId { get; set; }
    }
}
