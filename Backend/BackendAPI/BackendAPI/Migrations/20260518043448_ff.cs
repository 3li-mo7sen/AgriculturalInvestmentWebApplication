using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    /// <inheritdoc />
    public partial class ff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Contracts_InvestmentId",
                table: "Contracts");

            migrationBuilder.AddColumn<double>(
                name: "ExpectedRoiPercentage",
                table: "Investments",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "MaturityDate",
                table: "Investments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Investments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TransactionReference",
                table: "Investments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_InvestmentId",
                table: "Contracts",
                column: "InvestmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Contracts_InvestmentId",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "ExpectedRoiPercentage",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "MaturityDate",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Investments");

            migrationBuilder.DropColumn(
                name: "TransactionReference",
                table: "Investments");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_InvestmentId",
                table: "Contracts",
                column: "InvestmentId",
                unique: true);
        }
    }
}
