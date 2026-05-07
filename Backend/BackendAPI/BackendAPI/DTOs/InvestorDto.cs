using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class InvestorDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Balance { get; set; }
    }
}