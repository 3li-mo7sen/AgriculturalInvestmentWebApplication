using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }

        [StringLength(150)]
        public string? Name { get; set; }

        public string? Title { get; set; }
        public string? ProjectTitle { get; set; }
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Description { get; set; }
        public string? CropType { get; set; }
        public string? LandName { get; set; }
        public string? Governorate { get; set; }
        public string? District { get; set; }
        public string? Location { get; set; }
        public string? LandSize { get; set; }
        public string? SoilType { get; set; }
        public string? WaterSource { get; set; }
        public string? OwnershipType { get; set; }
        public string? CropSeason { get; set; }

        public decimal Cost { get; set; }

        public decimal? FundingAmount { get; set; }
        public decimal? TargetAmount { get; set; }
        public decimal? FundingRaised { get; set; }
        public int? FundingProgress { get; set; }
        public int? InvestorsCount { get; set; }
        public decimal? MinInvestment { get; set; }

        public decimal ExpectedProfit { get; set; }

        public string? ExpectedRoi { get; set; }
        public string? Roi { get; set; }

        public int Duration { get; set; }

        public int? FarmerId { get; set; }
        public string? FarmerName { get; set; }
        public int? FarmerShare { get; set; }

        public string? Status { get; set; }
    }
}
