namespace BackendAPI.Models
{
    public class Report
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Date { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }
}
