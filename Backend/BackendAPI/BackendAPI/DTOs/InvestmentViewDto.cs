using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class CreateInvestmentDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Investment amount must be greater than 0.")]
        public decimal Amount { get; set; }

        [Required]
        public bool AcceptedRiskTerms { get; set; }
    }

    public class InvestmentDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string CropType { get; set; } = string.Empty;
        public decimal AmountInjected { get; set; }
        public double RoiYield { get; set; }
        public decimal ExpectedTotalPayout => AmountInjected + (AmountInjected * (decimal)(RoiYield / 100.0));
        public string OrderStatus { get; set; } = string.Empty;
        public string TxRef { get; set; } = string.Empty;
        public DateTime PurchasedAt { get; set; }
        public DateTime EstMaturity { get; set; }
    }
}
