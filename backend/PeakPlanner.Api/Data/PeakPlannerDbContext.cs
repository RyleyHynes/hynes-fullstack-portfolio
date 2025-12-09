using System.Numerics;
using Microsoft.EntityFrameworkCore;
using PeakPlanner.Api.Models;

namespace PeakPlanner.Api.Data;

public class PeakPlannerDbContext: DbContext
{
    public PeakPlannerDbContext(DbContextOptions<PeakPlannerDbContext> options) : base(options) {}

    public DbSet<Peak> Peak => Set<Peak>();
}
