namespace BackendAPI.DTOs
{
    public class ProjectInvestorsDto
    {
        public int InvestorId { get; set; }
        public string InvestorName { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}
