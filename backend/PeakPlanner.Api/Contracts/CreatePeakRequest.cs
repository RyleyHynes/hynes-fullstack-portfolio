namespace PeakPlanner.Api.Contracts;

public record CreatePeakRequest(
    string Name,
    int ElevationMeters,
    double Latitude,
    double Longitude,
    string Country,
    string Region,
    string DifficultyRating,
    string Route,
    string Notes);