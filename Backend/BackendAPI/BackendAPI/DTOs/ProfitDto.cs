namespace BackendAPI.DTOs
{
    public class ProfitDto
    {
        public int InvestmentId { get; set; }

        public decimal InvestedAmount { get; set; }

        public decimal ExpectedProfit { get; set; }

        public decimal InvestorProfit { get; set; }

        public string ProjectName { get; set; }

        public string Status { get; set; }
    }
}