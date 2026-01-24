using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celium.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCelium : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Route");

            migrationBuilder.DropTable(
                name: "Peak");

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Summary = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    ActivityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Difficulty = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DistanceMiles = table.Column<double>(type: "double precision", nullable: false),
                    ElevationGainFt = table.Column<int>(type: "integer", nullable: false),
                    ElevationLossFt = table.Column<int>(type: "integer", nullable: true),
                    MaxElevationFt = table.Column<int>(type: "integer", nullable: true),
                    MinElevationFt = table.Column<int>(type: "integer", nullable: true),
                    EstimatedTimeMinutes = table.Column<int>(type: "integer", nullable: true),
                    LoopType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RouteGeometry = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: false),
                    StartLatitude = table.Column<double>(type: "double precision", nullable: false),
                    StartLongitude = table.Column<double>(type: "double precision", nullable: false),
                    EndLatitude = table.Column<double>(type: "double precision", nullable: false),
                    EndLongitude = table.Column<double>(type: "double precision", nullable: false),
                    LandscapeTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    RegionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.CreateTable(
                name: "Peak",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DifficultyRating = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ElevationMeters = table.Column<int>(type: "integer", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    Region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Peak", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Route",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PeakId = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DifficultyRating = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ElevationGainMeters = table.Column<int>(type: "integer", nullable: false),
                    LengthKm = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Route", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Route_Peak_PeakId",
                        column: x => x.PeakId,
                        principalTable: "Peak",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Route_PeakId",
                table: "Route",
                column: "PeakId");
        }
    }
}
