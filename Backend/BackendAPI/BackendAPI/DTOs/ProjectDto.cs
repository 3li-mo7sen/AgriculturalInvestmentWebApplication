using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal FundingRaised { get; set; }
        public int FundingProgress { get; set; }
        public decimal ExpectedProfit { get; set; }
        public int Duration { get; set; }
        public int FarmerId { get; set; }
        public string? FarmerName { get; set; }
        public string? ImageUrl { get; set; }
        public string Status { get; set; } = string.Empty;

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

        public decimal MinimumInvestment { get; set; }
        public int FarmerProfitShare { get; set; }
        public int InvestorProfitShare { get; set; }

        public string? LandOwnershipDocUrl { get; set; }
        public string? NationalIdDocUrl { get; set; }
        public string? AgriculturalPermitDocUrl { get; set; }
        public string? WaterRightsDocUrl { get; set; }
        public string? RejectionReason { get; set; }
    }
}
