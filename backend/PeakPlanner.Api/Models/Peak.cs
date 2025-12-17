namespace PeakPlanner.Api.Models;

public class Peak
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int ElevationMeters{get;set;}
    public double Latitude {get;set;}
    public string Country {get;set;} = string.Empty;
    public string Region {get;set;} = string.Empty;
    public string DifficultyRating {get;set;} = string.Empty;
    public ICollection<PeakRoute> Routes {get;set;} = new List<PeakRoute>();
    public string Notes {get;set;} = string.Empty;
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get;set;} = DateTime.UtcNow;

}

public class PeakRoute
{
    public Guid Id { get; set;}
    public Guid PeakId {get;set;}
    public required Peak Peak {get;set;}
    public string Description {get;set; } = string.Empty;
    public double LengthKm {get;set;}
    public int ElevationGainMeters {get;set;}
    public string DifficultyRating {get;set;} = string.Empty;
}