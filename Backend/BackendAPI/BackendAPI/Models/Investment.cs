using System;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models
{
    public enum InvestmentStatus
    {
        Pending,
        Active,
        Completed,
        Defaulted
    }

    public class Investment
    {
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }
        public Project? Project { get; set; }

        [Required]
        public int InvestorId { get; set; }
        public Investor? Investor { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public double ExpectedRoiPercentage { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime MaturityDate { get; set; }

        [Required]
        public InvestmentStatus Status { get; set; } = InvestmentStatus.Pending;

        public string TransactionReference { get; set; } = Guid.NewGuid().ToString("N");

        // Navigation array tracking legal issuance links
        public ICollection<Contract> AssociatedContracts { get; set; } = new List<Contract>();
    }
}