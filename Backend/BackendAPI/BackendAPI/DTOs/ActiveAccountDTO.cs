using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.DTOs
{
    public class ActiveAccountDTO
    {
        [FromQuery(Name = "email")]
        public string Email { get; set; }

        [FromQuery(Name = "code")]
        public string Token { get; set; }
        
    }
}
