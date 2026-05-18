namespace BackendAPI.DTOs
{
    public class RoleDashboardDto
    {
        public List<DashboardStatDto> Stats { get; set; } = new();
        public object RecentItems { get; set; } = null!;
        public object? Extra { get; set; }
    }

    public class DashboardStatDto
    {
        public string Title { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Description { get; set; }
        public string? Change { get; set; }
        public string? ChangeType { get; set; }
    }
}
