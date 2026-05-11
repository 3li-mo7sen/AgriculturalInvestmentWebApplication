using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class WalletDto
    {
        public decimal Balance { get; set; }
        public decimal TotalInvested { get; set; }
        public decimal TotalReturns { get; set; }
        public decimal TotalRaised { get; set; }
        public List<WalletTransactionDto> Transactions { get; set; } = new();
    }

    public class WalletTransactionDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string? ProjectName { get; set; }
    }

    public class WalletActionDto
    {
        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        public string? Note { get; set; }
    }
}
