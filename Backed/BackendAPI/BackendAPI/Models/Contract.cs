namespace BackendAPI.Models
{
    public class Contract
    {
        public int Id { get; set; }
        public string Terms { get; set; }
        public double ProfitShare { get; set; }
        public string Status { get; set; }

        public int InvestmentId { get; set; }
        public Investment Investment { get; set; }
    }
}
