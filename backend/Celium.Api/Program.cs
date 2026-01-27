using Celium.Api.Data;
using Celium.Api.Contracts;
using Celium.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.SwaggerUI;
using RouteModel = Celium.Api.Models.Route;

var builder = WebApplication.CreateBuilder(args);
var defaultLandscapeTypeId = Guid.Parse("00000000-0000-0000-0000-000000000001");
var defaultRegionId = Guid.Parse("00000000-0000-0000-0000-000000000010");

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<CeliumDbContext>(Options => Options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("celium-frontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseCors("celium-frontend");
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/swagger"))
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET,OPTIONS";
        context.Response.Headers["Access-Control-Allow-Headers"] = "*";
    }

    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = StatusCodes.Status200OK;
        return;
    }

    await next();
});
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
        {
            httpReq.HttpContext.Response.Headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
        });
    });
    app.UseSwaggerUI(options =>
    {
        options.SupportedSubmitMethods(Array.Empty<SubmitMethod>());
    });
}

var routes = app.MapGroup("/routes").WithOpenApi();

routes.MapGet("/", async (CeliumDbContext db) =>
{
    var results = await db.Routes.AsNoTracking().ToListAsync();
    return Results.Ok(results);
});

routes.MapGet("/{id:guid}", async (Guid id, CeliumDbContext db) =>
{
    var route = await db.Routes.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
    return route is null ? Results.NotFound() : Results.Ok(route);
});

routes.MapPost("/", async (CreateRouteRequest request, CeliumDbContext db) =>
{
    var now = DateTime.UtcNow;
    var route = new RouteModel
    {
        Id = Guid.NewGuid(),
        Name = request.Name,
        Summary = request.Summary,
        Description = request.Description,
        ActivityType = request.ActivityType,
        ClimbingStyle = request.ActivityType == ActivityType.RockClimbing ? request.ClimbingStyle : null,
        ClimbingGrade = request.ActivityType == ActivityType.RockClimbing ? request.ClimbingGrade : null,
        Difficulty = request.Difficulty,
        DistanceMiles = request.DistanceMiles,
        ElevationGainFt = request.ElevationGainFt,
        ElevationLossFt = request.ElevationLossFt,
        MaxElevationFt = request.MaxElevationFt,
        MinElevationFt = request.MinElevationFt,
        EstimatedTimeMinutes = request.EstimatedTimeMinutes,
        LoopType = request.LoopType,
        RouteGeometry = "LINESTRING(-105.0 39.7, -105.1 39.8)",
        StartLatitude = request.StartLatitude,
        StartLongitude = request.StartLongitude,
        EndLatitude = request.EndLatitude,
        EndLongitude = request.EndLongitude,
        LandscapeTypeId = defaultLandscapeTypeId,
        RegionId = defaultRegionId,
        Status = request.Status,
        Progress = request.Progress,
        CreatedAt = now,
        UpdatedAt = now,
        PublishedAt = request.PublishedAt
    };

    db.Routes.Add(route);
    await db.SaveChangesAsync();
    return Results.Created($"/routes/{route.Id}", route);
});

routes.MapPut("/{id:guid}", async (Guid id, UpdateRouteRequest request, CeliumDbContext db) =>
{
    var route = await db.Routes.FirstOrDefaultAsync(r => r.Id == id);
    if (route is null)
    {
        return Results.NotFound();
    }

    route.Name = request.Name;
    route.Summary = request.Summary;
    route.Description = request.Description;
    route.ActivityType = request.ActivityType;
    route.ClimbingStyle = request.ActivityType == ActivityType.RockClimbing ? request.ClimbingStyle : null;
    route.ClimbingGrade = request.ActivityType == ActivityType.RockClimbing ? request.ClimbingGrade : null;
    route.Difficulty = request.Difficulty;
    route.DistanceMiles = request.DistanceMiles;
    route.ElevationGainFt = request.ElevationGainFt;
    route.ElevationLossFt = request.ElevationLossFt;
    route.MaxElevationFt = request.MaxElevationFt;
    route.MinElevationFt = request.MinElevationFt;
    route.EstimatedTimeMinutes = request.EstimatedTimeMinutes;
    route.LoopType = request.LoopType;
    route.RouteGeometry = "LINESTRING(-105.0 39.7, -105.1 39.8)";
    route.StartLatitude = request.StartLatitude;
    route.StartLongitude = request.StartLongitude;
    route.EndLatitude = request.EndLatitude;
    route.EndLongitude = request.EndLongitude;
    route.LandscapeTypeId = defaultLandscapeTypeId;
    route.RegionId = defaultRegionId;
    route.Status = request.Status;
    route.Progress = request.Progress;
    route.PublishedAt = request.PublishedAt;
    route.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return Results.Ok(route);
});

routes.MapDelete("/{id:guid}", async (Guid id, CeliumDbContext db) =>
{
    var route = await db.Routes.FirstOrDefaultAsync(r => r.Id == id);
    if (route is null)
    {
        return Results.NotFound();
    }

    db.Routes.Remove(route);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
