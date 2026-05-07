using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; }

        [Range(1, double.MaxValue)]
        public decimal Cost { get; set; }

        [Range(1, double.MaxValue)]
        public decimal ExpectedProfit { get; set; }

        [Range(1, 120)]
        public int Duration { get; set; }

        public string? Status { get; set; }
    }
}