namespace BackendAPI.DTOs
{
    public class InvestmentViewDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public string InvestorName { get; set; }
        public string ProjectName { get; set; }
    }
}
