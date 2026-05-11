using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(50)]
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public bool EmailConfirmed { get; set; }
        public string? EmailVerificationToken { get; set; }
        public DateTime? EmailVerificationTokenExpiry { get; set; }
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
    }
}
