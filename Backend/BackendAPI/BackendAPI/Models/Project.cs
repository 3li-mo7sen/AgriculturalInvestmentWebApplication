namespace BackendAPI.Models
{
    public enum ProjectStatus
    {
        Pending,
        Approved,
        Published,
        Rejected
    }
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Cost { get; set; }
        public decimal ExpectedProfit { get; set; }
        public int Duration { get; set; }
        public ProjectStatus Status { get; set; }
        public int FarmerId { get; set; }
        public Farmer Farmer { get; set; }

        public List<Investment> Investments { get; set; }
        public List<Report> Reports { get; set; }
    }
}
