namespace BackendAPI.DTOs
{
    public class InvestmentViewDto
    {
        public int Id { get; set; }
        public int InvestorId { get; set; }
        public int ProjectId { get; set; }
        public decimal Amount { get; set; }
        public decimal ExpectedReturn { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }

        public string InvestorName { get; set; }
        public string ProjectName { get; set; }
    }
}
