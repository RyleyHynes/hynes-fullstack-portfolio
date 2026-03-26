using Celium.Api.Data;
using Celium.Api.Contracts;
using Celium.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using RouteModel = Celium.Api.Models.Route;

var builder = WebApplication.CreateBuilder(args);
var defaultLandscapeTypeId = Guid.Parse("00000000-0000-0000-0000-000000000001");
var defaultRegionId = Guid.Parse("00000000-0000-0000-0000-000000000010");

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
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

var auth0Domain = builder.Configuration["Auth0:Domain"];
var auth0Audience = builder.Configuration["Auth0:Audience"];
var authRoleClaim = builder.Configuration["Auth0:RoleClaim"] ?? "https://celium.app/roles";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://{auth0Domain}/";
        options.Audience = auth0Audience;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "name",
            RoleClaimType = authRoleClaim
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("[Auth] Authentication failed: " + context.Exception?.Message);
                return Task.CompletedTask;
            },
            OnChallenge = async context =>
            {
                // prevent default redirect/body and write structured JSON
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";

                var payload = new
                {
                    error = "Unauthorized",
                    detail = context.ErrorDescription ?? context.Error ?? "Invalid or missing authorization token.",
                    audience = auth0Audience,
                    requiredPermission = "routes:write (or routes:create/update/delete/* if policy allows)",
                    path = context.Request.Path
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("routes:write", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireAssertion(context =>
        {
            if (context.User.IsInRole("Admin")) return true;
            return context.User.Claims.Any(claim =>
                claim.Type == "permissions" &&
                (claim.Value == "routes:write" ||
                 claim.Value == "routes:*" ||
                 claim.Value == "routes:create" ||
                 claim.Value == "routes:update" ||
                 claim.Value == "routes:delete"));
        });
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("celium-frontend");

app.UseStatusCodePages(async context =>
{
    var status = context.HttpContext.Response.StatusCode;
    if (status == StatusCodes.Status401Unauthorized || status == StatusCodes.Status403Forbidden)
    {
        var user = context.HttpContext.User;
        var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        var permissions = user.FindAll("permissions").Select(c => c.Value).ToArray();

        var response = new
        {
            error = status == StatusCodes.Status401Unauthorized ? "Unauthorized" : "Forbidden",
            detail = status == StatusCodes.Status401Unauthorized
                ? "Missing or invalid bearer token. Please re-authenticate."
                : "Authenticated but missing required route permissions.",
            status,
            path = context.HttpContext.Request.Path,
            isAuthenticated = user.Identity?.IsAuthenticated ?? false,
            userName = user.Identity?.Name,
            roles,
            permissions,
            expectedPolicy = "routes:write | routes:create/update/delete/*"
        };

        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/users/me", (ClaimsPrincipal user) =>
{
    var claims = user.Claims
        .GroupBy(claim => claim.Type)
        .ToDictionary(group => group.Key, group => group.Select(claim => claim.Value).ToArray());

    return Results.Ok(new
    {
        IsAuthenticated = user.Identity?.IsAuthenticated ?? false,
        Name = user.Identity?.Name,
        Roles = user.FindAll(ClaimTypes.Role).Select(role => role.Value).ToArray(),
        Permissions = user.FindAll("permissions").Select(permission => permission.Value).ToArray(),
        Claims = claims
    });
}).RequireAuthorization();

var routes = app.MapGroup("/routes")
    .WithOpenApi()
    .RequireAuthorization();

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
        CreatedAt = now,
        UpdatedAt = now,
        PublishedAt = request.PublishedAt
    };

    db.Routes.Add(route);
    await db.SaveChangesAsync();
    return Results.Created($"/routes/{route.Id}", route);
}).RequireAuthorization("routes:write");

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
    route.PublishedAt = request.PublishedAt;
    route.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return Results.Ok(route);
}).RequireAuthorization("routes:write");

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
}).RequireAuthorization("routes:write");

app.Run();
