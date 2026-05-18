namespace BackendAPI.Models
{
    public class Contract
    {
        public int Id { get; set; }
        public string Terms { get; set; } = string.Empty;
        public decimal ProfitShare { get; set; } // Represented fractionally ( 0.08m for 8% project net stake)
        public ContractStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public int InvestmentId { get; set; }
        public Investment Investment { get; set; } = null!;
    }
}