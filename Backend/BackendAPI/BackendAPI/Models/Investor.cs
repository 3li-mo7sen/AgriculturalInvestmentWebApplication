namespace BackendAPI.Models
{
    public class Investor  : User
    {
        public decimal Balance { get; set; }

        public List<Investment> Investments { get; set; }
    }
}
