namespace BackendAPI.Models
{
    public class Farmer : User
    {
        public string FarmInfo { get; set; }
        public string LandDetails { get; set; }

        public List<Project> Projects { get; set; }
    }
}
