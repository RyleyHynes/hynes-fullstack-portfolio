using Celium.Api.Models;

namespace Celium.Api.Contracts;

public record CreateRouteRequest(
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
    double StartLatitude,
    double StartLongitude,
    double EndLatitude,
    double EndLongitude,
    RouteStatus Status,
    DateTime? PublishedAt);
