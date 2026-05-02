using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
