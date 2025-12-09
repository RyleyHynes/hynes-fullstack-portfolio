namespace PeakPlanner.Api.Contracts;

public record CreateRouteRequest(
    Guid PeakId,
    string Description,
    double LengthKm,
    int ElevationGainMeters,
    string DifficultyRating);