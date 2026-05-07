namespace BackendAPI.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Cost { get; set; }

        public decimal ExpectedProfit { get; set; }

        public int Duration { get; set; }

        public string? Status { get; set; }

    }
}