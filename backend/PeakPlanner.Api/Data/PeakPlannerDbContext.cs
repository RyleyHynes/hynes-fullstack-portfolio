using Microsoft.EntityFrameworkCore;
using PeakPlanner.Api.Models;

namespace PeakPlanner.Api.Data;

public class PeakPlannerDbContext : DbContext
{
    public PeakPlannerDbContext(DbContextOptions<PeakPlannerDbContext> options) : base(options) { }

    public DbSet<Peak> Peak => Set<Peak>();
    public DbSet<PeakRoute> Route => Set<PeakRoute>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Peak>(entity =>
        {
            entity.Property(p => p.Name).HasMaxLength(200).IsRequired();
            entity.Property(p => p.Country).HasMaxLength(100);
            entity.Property(p => p.Region).HasMaxLength(100);
            entity.Property(p => p.DifficultyRating).HasMaxLength(50);
        });

        modelBuilder.Entity<PeakRoute>(entity =>
        {
            entity.HasOne(r => r.Peak)
            .WithMany(p => p.Routes)
            .HasForeignKey(r => r.PeakId)
            .OnDelete(DeleteBehavior.Cascade);

            entity.Property(r => r.Description).HasMaxLength(500);
            entity.Property(r => r.DifficultyRating).HasMaxLength(50);
        });
    }
}
