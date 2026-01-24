using Celium.Api.Models;

namespace Celium.Api.Contracts;

public record UpdateRouteRequest(
    string Name,
    string Summary,
    string? Description,
    ActivityType ActivityType,
    Difficulty Difficulty,
    double DistanceMiles,
    int ElevationGainFt,
    int? ElevationLossFt,
    int? MaxElevationFt,
    int? MinElevationFt,
    int? EstimatedTimeMinutes,
    LoopType LoopType,
    string RouteGeometry,
    double StartLatitude,
    double StartLongitude,
    double EndLatitude,
    double EndLongitude,
    Guid LandscapeTypeId,
    Guid RegionId,
    RouteStatus Status,
    DateTime? PublishedAt);
