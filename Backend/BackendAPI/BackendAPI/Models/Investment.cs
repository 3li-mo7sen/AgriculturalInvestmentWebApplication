namespace BackendAPI.Models
{
    public class Investment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public int InvestorId { get; set; }
        public Investor Investor { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public Contract Contract { get; set; }
    }
}
