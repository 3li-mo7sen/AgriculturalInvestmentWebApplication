using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models
{
    public class WalletTransaction
    {
        public int Id { get; set; }

        // Links the transaction directly to the Farmer's account
        public int FarmerId { get; set; }
        public Farmer? Farmer { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Type { get; set; } = "Deposit"; // Options: "Deposit", "Withdrawal", "InvestmentPayout"

        [Required]
        public string Status { get; set; } = "Pending"; // Options: "Pending", "Success", "Failed"

        // Optional description text to display in the UI list ("Withdrawal to Bank Account")
        public string Description { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
