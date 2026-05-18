namespace BackendAPI.Models
{
    public class Farmer : User
    {
        public string FarmInfo { get; set; } = string.Empty;
        public string LandDetails { get; set; } = string.Empty;
        public decimal Balance { get; set; } // Added to prevent the total raised math vulnerability

        public List<Project> Projects { get; set; } = new();
    }
}
