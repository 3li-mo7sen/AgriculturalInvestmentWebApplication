namespace BackendAPI.DTOs
{
    public class ContractDto
    {
        public int Id { get; set; }
        public decimal ProfitShare { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public int InvestmentId { get; set; }
        public string InvestorName { get; set; }
        public string ProjectName { get; set; }
    }
}
