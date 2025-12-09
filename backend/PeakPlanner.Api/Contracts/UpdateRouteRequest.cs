namespace PeakPlanner.Api.Contracts;

public record UpdateRouteRequest(
    string Description,
    double LengthKm,
    int ElevationGainMeters,
    string DifficultyRating);