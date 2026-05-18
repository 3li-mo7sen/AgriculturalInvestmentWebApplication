using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class CreateProjectDto
    {
        [Required] public string Name { get; set; } = string.Empty;
        [Range(1, 100000000)] public decimal Cost { get; set; }
        [Range(0, 100000000)] public decimal ExpectedProfit { get; set; }
        [Range(1, 120)] public int Duration { get; set; }

        public IFormFile? Image { get; set; }

        [Required] public string ShortDescription { get; set; } = string.Empty;
        [Required] public string FullDescription { get; set; } = string.Empty;
        [Required] public string CropType { get; set; } = string.Empty;
        [Required] public string Governorate { get; set; } = string.Empty;
        [Required] public string District { get; set; } = string.Empty;
        [Range(0.01, 100000)] public double LandSize { get; set; }
        [Required] public string SoilType { get; set; } = string.Empty;
        [Required] public string WaterSource { get; set; } = string.Empty;
        [Required] public string LandOwnershipType { get; set; } = string.Empty;
        [Required] public string ExpectedCropSeason { get; set; } = string.Empty;

        [Range(1, 10000000)] public decimal MinimumInvestment { get; set; }
        [Range(1, 99)] public int FarmerProfitShare { get; set; }
        [Range(1, 99)] public int InvestorProfitShare { get; set; }

        public IFormFile? LandOwnershipDoc { get; set; }
        public IFormFile? NationalIdDoc { get; set; }
        public IFormFile? AgriculturalPermitDoc { get; set; }
        public IFormFile? WaterRightsDoc { get; set; }
    }
}
