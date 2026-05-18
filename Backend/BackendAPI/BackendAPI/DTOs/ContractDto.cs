namespace BackendAPI.DTOs
{
    public class ContractDto
    {
        public int Id { get; set; }
        public string ContractNumber { get; set; } = string.Empty;
        public string? Terms { get; set; }
        public decimal ProfitShare { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public int InvestmentId { get; set; }
        public int ProjectId { get; set; }
        public string? InvestorName { get; set; }
        public string? ProjectName { get; set; }
        public decimal Amount { get; set; }
        public decimal TotalAmount { get; set; }
        public int InvestorCount { get; set; }
        public List<ProjectInvestorsDto> Investors { get; set; } = new();
    }

    public class ProjectInvestorsDto
    {
        public int InvestorId { get; set; }
        public string InvestorName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}
