using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RainstormTech.Data.Models.BaseModels;
using RainstormTech.Models.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using RainstormTech.Models;

namespace RainstormTech.Data.Data
{
    public partial class ApplicationContext : IdentityDbContext<
        ApplicationUser, ApplicationRole, Guid,
        ApplicationUserClaim, ApplicationUserRole, ApplicationUserLogin,
        ApplicationRoleClaim, ApplicationUserToken>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
                
        public ApplicationContext(DbContextOptions<ApplicationContext> options, IHttpContextAccessor httpContextAccessor = null)
            : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }


        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<ApplicationRole> ApplicationRoles { get; set; }
        public virtual DbSet<ApplicationRoleClaim> ApplicationRoleClaims { get; set; }
        public virtual DbSet<ApplicationUserRole> ApplicationUserRoles { get; set; }
        public virtual DbSet<ApplicationUserClaim> ApplicationUserClaims { get; set; }
        public virtual DbSet<ApplicationUserLogin> ApplicationUserLogins { get; set; }
        public virtual DbSet<ApplicationUserToken> ApplicationUserTokens { get; set; }
        public virtual DbSet<Contact> Contact { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>(b =>
            {
                // Each User can have many UserClaims
                b.HasMany(e => e.Claims)
                    .WithOne(e => e.User)
                    .HasForeignKey(uc => uc.UserId)
                    .IsRequired();

                // Each User can have many UserLogins
                b.HasMany(e => e.Logins)
                    .WithOne(e => e.User)
                    .HasForeignKey(ul => ul.UserId)
                    .IsRequired();

                // Each User can have many UserTokens
                b.HasMany(e => e.Tokens)
                    .WithOne(e => e.User)
                    .HasForeignKey(ut => ut.UserId)
                    .IsRequired();

                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();

                b.HasOne(e => e.Contact)
                    .WithMany()
                    .HasForeignKey(e => e.ContactId)
                    .IsRequired();
            });

            modelBuilder.Entity<ApplicationRole>(b =>
            {
                // Each Role can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                // Each Role can have many associated RoleClaims
                b.HasMany(e => e.RoleClaims)
                    .WithOne(e => e.Role)
                    .HasForeignKey(rc => rc.RoleId)
                    .IsRequired();
            });
            
            OnModelCreatingPartial(modelBuilder);
        }


        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

        public override int SaveChanges()
        {
            AddAuditInfo();
            return base.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            AddAuditInfo();
            return await base.SaveChangesAsync();
        }

        private void AddAuditInfo()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return;
            }
            var authenticatedUserId = _httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (authenticatedUserId == null)
                return;

            // check to make sure the user exists
            var userId = Users.FirstOrDefault(u2 => u2.Id.ToString() == authenticatedUserId).Id;


            var entries = ChangeTracker.Entries().Where(x => 
                (x.Entity is BaseTrackedByModel || x.Entity is BaseTrackedModel) && 
                (x.State == EntityState.Added || x.State == EntityState.Modified)
            );


            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    ((BaseTrackedModel)entry.Entity).CreatedOn = DateTime.UtcNow;

                    if(entry.Entity is BaseTrackedByModel)
                        ((BaseTrackedByModel)entry.Entity).CreatedBy = userId;
                    return;
                }
                ((BaseTrackedModel)entry.Entity).UpdatedOn = DateTime.UtcNow;

                if (entry.Entity is BaseTrackedByModel)
                    ((BaseTrackedByModel)entry.Entity).UpdatedBy = userId;
            }


            var entries2 = ChangeTracker.Entries().Where(x =>
                (x.Entity is BaseIntTrackedByModel || x.Entity is BaseIntTrackedModel) &&
                (x.State == EntityState.Added || x.State == EntityState.Modified)
            );

            foreach (var entry in entries2)
            {
                if (entry.State == EntityState.Added)
                {
                    ((BaseIntTrackedModel)entry.Entity).CreatedOn = DateTime.UtcNow;

                    if (entry.Entity is BaseIntTrackedByModel && entry.Entity.GetType().GetProperty("CreatedBy") != null)
                        ((BaseIntTrackedByModel)entry.Entity).CreatedBy = userId;
                    return;
                }
                ((BaseIntTrackedModel)entry.Entity).UpdatedOn = DateTime.UtcNow;

                if (entry.Entity is BaseIntTrackedByModel && entry.Entity.GetType().GetProperty("UpdatedBy") != null)
                    ((BaseIntTrackedByModel)entry.Entity).UpdatedBy = userId;
            }
        }
    }
}
