using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; }

        public DateTime Date { get; set; }

        [Required]
        public int ProjectId { get; set; }
    }
}