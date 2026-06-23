using Microsoft.EntityFrameworkCore;

namespace NetApi.Data
{
    public interface ITenantEntity
    {
        string TenantId { get; set; }
    }

    public class Resident : ITenantEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
        public decimal Balance { get; set; } = 0.0m;
        public string TenantId { get; set; } = string.Empty;
    }

    public class ApplicationDbContext : DbContext
    {
        private readonly string _tenantId;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IHttpContextAccessor httpContextAccessor)
            : base(options)
        {
            // Extract the TenantId from the current user's claims (Clerk metadata/organization claim)
            // Typically Clerk sets this in the org_id claim or a custom metadata claim.
            _tenantId = httpContextAccessor.HttpContext?.User?.FindFirst("org_id")?.Value ?? string.Empty;
        }

        public DbSet<Resident> Residents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Global Query Filter for Multi-Tenancy
            // Automatically applies to all queries for BusinessData
            modelBuilder.Entity<Resident>().HasQueryFilter(e => e.TenantId == _tenantId);
        }

        public override int SaveChanges()
        {
            SetTenantIdOnAddedEntities();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetTenantIdOnAddedEntities();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void SetTenantIdOnAddedEntities()
        {
            var entries = ChangeTracker.Entries<ITenantEntity>().Where(e => e.State == EntityState.Added);
            foreach (var entry in entries)
            {
                if (string.IsNullOrEmpty(entry.Entity.TenantId))
                {
                    entry.Entity.TenantId = _tenantId;
                }
            }
        }
    }
}