using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Farmer> Farmers { get; set; }
        public DbSet<Investor> Investors { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<ExpertTeam> ExpertTeams { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<UserChatPreference> UserChatPreferences { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<SystemTransaction> SystemTransactions { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== Inheritance (TPH) =====
            modelBuilder.Entity<User>()
                .HasDiscriminator<string>("Role")
                .HasValue<Farmer>("Farmer")
                .HasValue<Investor>("Investor")
                .HasValue<Admin>("Admin")
                .HasValue<ExpertTeam>("Expert");

            // ===== Email Constraints (IMPORTANT) =====
            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired()           
                .HasMaxLength(100);      

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();              

            // ===== FIX CASCADE DELETE ISSUE =====
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Farmer)
                .WithMany(f => f.Projects)
                .HasForeignKey(p => p.FarmerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Investment>()
                .HasOne(i => i.Investor)
                .WithMany(i => i.Investments)
                .HasForeignKey(i => i.InvestorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Investment>()
                .HasOne(i => i.Project)
                .WithMany(p => p.Investments)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ===== DECIMAL PRECISION =====
            modelBuilder.Entity<Project>()
                .Property(p => p.Cost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Project>()
                .Property(p => p.ExpectedProfit)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Investment>()
                .Property(i => i.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Investor>()
                .Property(i => i.Balance)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Contract>()
                .Property(c => c.ProfitShare)
                .HasPrecision(5, 2);
        }
    }
}