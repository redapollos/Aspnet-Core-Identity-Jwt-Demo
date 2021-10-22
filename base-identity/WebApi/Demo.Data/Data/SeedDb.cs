using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using RainstormTech.Models;
using RainstormTech.Models.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RainstormTech.Data.Data
{
    public class SeedDb
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            const string adminEmail = "admin@website.com";
            const string adminPassword = "passW0rd!";
            const string adminUsername = "admin";
            const string adminFirst = "Admin";
            const string adminLast = "Contact";

            var context = serviceProvider.GetRequiredService<ApplicationContext>();
            context.Database.EnsureCreated();

            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();


            // initially create user(s)
            if (!context.Users.Any())
            {
                ApplicationUser user = new ApplicationUser()
                {
                    Email = adminEmail, SecurityStamp = Guid.NewGuid().ToString(), UserName = adminUsername, CreatedOn = DateTime.UtcNow,
                        Contact = new Contact() { Email = adminEmail, FirstName = adminFirst, LastName = adminLast, CreatedOn = DateTime.UtcNow }
                };
                var result = userManager.CreateAsync(user, adminPassword).Result;
            }

            // get the admin user we just made
            var adminUser = userManager.FindByEmailAsync(adminEmail).Result;
            if (adminUser == null)
                return;

            // make sure we have some roles
            if (!context.Roles.Any())
            {
                ApplicationRole role = new ApplicationRole() { Name = "Administrator" };

                var result = roleManager.CreateAsync(role).Result;

                // assign admin role to admin
                var ur = userManager.AddToRoleAsync(adminUser, "Administrator").Result;
            }
        }
    }
}
