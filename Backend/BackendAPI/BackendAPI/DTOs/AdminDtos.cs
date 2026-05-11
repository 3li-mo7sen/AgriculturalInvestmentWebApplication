using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class AdminUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public string KycStatus { get; set; }
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public int ProjectsCount { get; set; }
        public int InvestmentsCount { get; set; }
        public int ReviewsCount { get; set; }
    }

    public class AdminCreateUserDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }

        public string? PhoneNumber { get; set; }
        public string? LandDetails { get; set; }
        public decimal Balance { get; set; }
    }

    public class UpdateUserStatusDto
    {
        [Required]
        public string Status { get; set; }
    }

    public class AdminProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Farmer { get; set; }
        public string? Location { get; set; }
        public string Status { get; set; }
        public decimal FundingGoal { get; set; }
        public decimal FundingRaised { get; set; }
        public int InvestorCount { get; set; }
        public string? CropType { get; set; }
        public string ExpectedRoi { get; set; }
    }

    public class PlatformSettingsDto
    {
        public string PlatformName { get; set; } = "Agri-Pro";
        public string PlatformDescription { get; set; } = "Connecting farmers and investors for agricultural growth";
        public string SupportEmail { get; set; } = "support@agri-pro.com";
        public string DefaultCurrency { get; set; } = "EGP";
        public decimal MinInvestment { get; set; } = 10000;
        public decimal MaxInvestment { get; set; } = 5000000;
        public decimal PlatformFee { get; set; } = 2.5m;
    }
}
