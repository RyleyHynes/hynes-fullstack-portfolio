namespace Celium.Api.Models;

public enum ActivityType
{
    Hiking,
    TrailRunning,
    RockClimbing
}

public enum Difficulty
{
    Easy,
    Moderate,
    Hard,
    Expert
}

public enum LoopType
{
    Loop,
    OutAndBack,
    PointToPoint
}

public enum RouteStatus
{
    Published,
    Archived
}

public enum ClimbingStyle
{
    Sport,
    Trad,
    Bouldering,
    Ice
}

public enum RouteProgress
{
    Todo,
    Completed
}

public class Route
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ActivityType ActivityType { get; set; } = ActivityType.Hiking;
    public ClimbingStyle? ClimbingStyle { get; set; }
    public string? ClimbingGrade { get; set; }
    public Difficulty Difficulty { get; set; } = Difficulty.Moderate;
    public double DistanceMiles { get; set; }
    public int ElevationGainFt { get; set; }
    public int? ElevationLossFt { get; set; }
    public int? MaxElevationFt { get; set; }
    public int? MinElevationFt { get; set; }
    public int? EstimatedTimeMinutes { get; set; }
    public LoopType LoopType { get; set; } = LoopType.Loop;
    public string RouteGeometry { get; set; } = string.Empty;
    public double StartLatitude { get; set; }
    public double StartLongitude { get; set; }
    public double EndLatitude { get; set; }
    public double EndLongitude { get; set; }
    public Guid LandscapeTypeId { get; set; }
    public Guid RegionId { get; set; }
    public RouteStatus Status { get; set; } = RouteStatus.Published;
    public RouteProgress Progress { get; set; } = RouteProgress.Todo;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PublishedAt { get; set; }
}
