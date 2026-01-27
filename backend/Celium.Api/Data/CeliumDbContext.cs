using Microsoft.EntityFrameworkCore;
using Celium.Api.Models;
using RouteModel = Celium.Api.Models.Route;

namespace Celium.Api.Data;

public class CeliumDbContext : DbContext
{
    public CeliumDbContext(DbContextOptions<CeliumDbContext> options) : base(options) { }

    public DbSet<RouteModel> Routes => Set<RouteModel>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RouteModel>(entity =>
        {
            entity.Property(r => r.Name).HasMaxLength(200).IsRequired();
            entity.Property(r => r.Summary).HasMaxLength(500).IsRequired();
            entity.Property(r => r.Description).HasMaxLength(4000);
            entity.Property(r => r.RouteGeometry).HasMaxLength(10000).IsRequired();
            entity.Property(r => r.ActivityType).HasConversion<string>().HasMaxLength(50);
            entity.Property(r => r.ClimbingStyle).HasConversion<string>().HasMaxLength(50);
            entity.Property(r => r.ClimbingGrade).HasMaxLength(20);
            entity.Property(r => r.Difficulty).HasConversion<string>().HasMaxLength(50);
            entity.Property(r => r.LoopType).HasConversion<string>().HasMaxLength(50);
            entity.Property(r => r.Status).HasConversion<string>().HasMaxLength(50);
            entity.Property(r => r.Progress).HasConversion<string>().HasMaxLength(50);
        });
    }
}
