namespace BackendAPI.DTOs
{
    public class DashboardStatDto
    {
        public string Title { get; set; }
        public string Value { get; set; }
        public string? Change { get; set; }
        public string? ChangeType { get; set; }
        public string? Description { get; set; }
    }

    public class DashboardActivityDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public string Time { get; set; }
        public string Status { get; set; }
    }

    public class RoleDashboardDto
    {
        public List<DashboardStatDto> Stats { get; set; } = new();
        public object? RecentItems { get; set; }
        public object? Extra { get; set; }
    }
}
