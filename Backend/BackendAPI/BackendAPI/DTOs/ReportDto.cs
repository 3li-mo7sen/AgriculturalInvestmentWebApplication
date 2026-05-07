namespace BackendAPI.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }

        public string Content { get; set; }

        public DateTime Date { get; set; }

        public int ProjectId { get; set; }
    }
}