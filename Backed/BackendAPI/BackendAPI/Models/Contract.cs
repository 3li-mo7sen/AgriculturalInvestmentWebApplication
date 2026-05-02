namespace BackendAPI.Models
{
    public enum ContractStatus
    {
        Pending,
        Active,
        Completed,
        Cancelled
    }

    public class Contract
    {
        public int Id { get; set; }

        public string Terms { get; set; }

        public decimal ProfitShare { get; set; }

        public ContractStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public int InvestmentId { get; set; }
        public Investment Investment { get; set; }
    }
}