using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool EmailConfirmed { get; set; }
        public string Status { get; set; }
        public string KycStatus { get; set; }
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public string? Specialization { get; set; }
        public object? Stats { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? Name { get; set; }
        public string? FullName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? Phone { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public string? LandDetails { get; set; }
        public string? FarmInfo { get; set; }
        public string? Specialization { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }

        [Required]
        [MinLength(6)]
        public string ConfirmPassword { get; set; }
    }

    public class AccountSettingsDto
    {
        public bool EmailNotifications { get; set; } = true;
        public bool SmsNotifications { get; set; } = true;
        public bool InvestmentAlerts { get; set; } = true;
        public bool ProjectUpdates { get; set; } = true;
        public bool ReturnAlerts { get; set; } = true;
        public bool NewProjectAlerts { get; set; } = true;
        public bool NewReviewAlerts { get; set; } = true;
        public bool UrgentReviewAlerts { get; set; } = true;
        public bool SystemAlerts { get; set; } = true;
        public bool MarketingEmails { get; set; }
        public bool TwoFactorAuth { get; set; }
        public bool LoginAlerts { get; set; } = true;
    }
}
