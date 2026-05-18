using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Data
{
    public class AppDbContext : DbContext
    {
        // ==========================================
        //             DATABASE TABLES (DbSets)
        // ==========================================

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

        // CHANGED: Added the new table backing the Farmer Notification alert center streams
        public DbSet<Notification> Notifications { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==================================================
            //      INHERITANCE MAPPING: Table-Per-Hierarchy (TPH)
            // ==================================================
            // Maps concrete child roles cleanly into a single unified shared "Users" database table
            modelBuilder.Entity<User>()
                .HasDiscriminator<string>("Role")
                .HasValue<Farmer>("Farmer")
                .HasValue<Investor>("Investor")
                .HasValue<Admin>("Admin")
                .HasValue<ExpertTeam>("Expert");

            // ==================================================
            //           EMAIL UNIQUE CONSTRAINTS
            // ==================================================
            // Sets requirements for identity tracking keys and flags logins as unique indexes
            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ==================================================
            //         RELATIONSHIPS & CASCADE CONSTRAINTS
            // ==================================================

            // Farmer-to-Projects: Prevents dropping ongoing project profiles when a profile row is deleted
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Farmer)
                .WithMany(f => f.Projects)
                .HasForeignKey(p => p.FarmerId)
                .OnDelete(DeleteBehavior.NoAction);

            // Investor-to-Investments: Halts deletion if capital transactions are tied to the profile context
            modelBuilder.Entity<Investment>()
                .HasOne(i => i.Investor)
                .WithMany(i => i.Investments)
                .HasForeignKey(i => i.InvestorId)
                .OnDelete(DeleteBehavior.NoAction);

            // Project-to-Investments: Cascades downward cleanly to wipe asset listings if the parent project drops
            modelBuilder.Entity<Investment>()
                .HasOne(i => i.Project)
                .WithMany(p => p.Investments)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // CHANGED: Notification-to-User: Setup relational linkage mapping alerts directly to explicit user keys
            modelBuilder.Entity<Notification>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================================================
            //         PROPERTY ENUM TYPE CONVERSIONS
            // ==================================================

            // CHANGED: Forces the ProjectStatus Enum values to store natively in SQL tables as Strings ("Pending", "Approved", etc.)
            modelBuilder.Entity<Project>()
                .Property(p => p.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            // ==================================================
            //       MONETARY & DECIMAL FIELD PRECISION FIXES
            // ==================================================

            // Configures standard currency formatting models to protect high values from truncation anomalies
            modelBuilder.Entity<Project>()
                .Property(p => p.Cost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Project>()
                .Property(p => p.ExpectedProfit)
                .HasPrecision(18, 2);

            // CHANGED: Configures minimum entry stakes limit fields explicitly
            modelBuilder.Entity<Project>()
                .Property(p => p.MinimumInvestment)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Investment>()
                .Property(i => i.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Investor>()
                .Property(i => i.Balance)
                .HasPrecision(18, 2);

            // CHANGED: Configures precision values onto Farmer balance objects directly 
            modelBuilder.Entity<Farmer>()
                .Property(f => f.Balance)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Contract>()
                .Property(c => c.ProfitShare)
                .HasPrecision(5, 2);

            // CHANGED: Maps internal historical ledger logs currency decimals cleanly to match transactions interface
            modelBuilder.Entity<SystemTransaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);
        }
    }
}