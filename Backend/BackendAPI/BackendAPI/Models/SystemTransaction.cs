namespace BackendAPI.Models
{
    public class SystemTransaction
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Maps back structurally to core base user identity block
        public TransactionType Type { get; set; }
        public decimal Amount { get; set; } // Absolute positive or relative signed values
        public DateTime Timestamp { get; set; }
        public string Description { get; set; } = string.Empty;
        public int? ProjectId { get; set; }
    }
}
