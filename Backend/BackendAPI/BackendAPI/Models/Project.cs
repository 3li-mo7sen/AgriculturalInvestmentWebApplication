namespace BackendAPI.Models
{
 
   public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal ExpectedProfit { get; set; }
        public int Duration { get; set; }
        public ProjectStatus Status { get; set; }
        public string? ImageUrl { get; set; }

        // Multi-Step UI Form Fields
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? CropType { get; set; }
        public string? Governorate { get; set; }
        public string? District { get; set; }
        public double LandSize { get; set; }
        public string? SoilType { get; set; }
        public string? WaterSource { get; set; }
        public string? LandOwnershipType { get; set; }
        public string? ExpectedCropSeason { get; set; }

        // Investment Matrix Configuration
        public decimal MinimumInvestment { get; set; }
        public int FarmerProfitShare { get; set; }     // 60 (for 60%)
        public int InvestorProfitShare { get; set; }   //  40 (for 40%)

        // Secure Document Management Storage Path Uniform Resource Locators
        public string? LandOwnershipDocUrl { get; set; }
        public string? NationalIdDocUrl { get; set; }
        public string? AgriculturalPermitDocUrl { get; set; }
        public string? WaterRightsDocUrl { get; set; }
        public string? RejectionReason { get; set; }

        // Navigation Context Topology Relationships
        public int FarmerId { get; set; }
        public Farmer Farmer { get; set; } = null!;
        public List<Investment> Investments { get; set; } = new();
        public List<Report> Reports { get; set; } = new();
    }
}
