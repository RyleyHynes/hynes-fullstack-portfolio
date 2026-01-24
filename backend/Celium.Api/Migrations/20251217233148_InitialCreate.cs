using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celium.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Peak",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ElevationMeters = table.Column<int>(type: "integer", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DifficultyRating = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                    LengthKm = table.Column<double>(type: "double precision", nullable: false),
                    ElevationGainMeters = table.Column<int>(type: "integer", nullable: false),
                    DifficultyRating = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Route");

            migrationBuilder.DropTable(
                name: "Peak");
        }
    }
}
