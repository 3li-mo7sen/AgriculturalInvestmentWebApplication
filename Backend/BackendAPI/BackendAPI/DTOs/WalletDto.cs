namespace BackendAPI.DTOs
{
    public class WalletDto
    {
        public decimal Balance { get; set; }
        public decimal TotalRaised { get; set; }
        public decimal TotalInvested { get; set; }
        public decimal TotalReturns { get; set; }
        public List<WalletTransactionDto> Transactions { get; set; } = new();
    }

    public class WalletTransactionDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ProjectName { get; set; }
    }

    public class WalletActionDto
    {
        public decimal Amount { get; set; }
    }

    public class FarmerSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public int TotalProjectsCount { get; set; }
        public double TotalLandSizeFeddan { get; set; }
        public int ActiveContractsCount { get; set; }
    }

    public class WalletSummaryDto
    {
        public decimal CurrentBalance { get; set; }
        public List<WalletTransactionDto> RecentTransactions { get; set; } = new();
    }
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
