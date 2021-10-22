using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

/*
 * "View" roles will map to the related pages loading in the nav
 */

namespace RainstormTech.Api.Components.Authorization
{
    public static class SystemClaims
    {
        public static List<Claim> GetClaims()
        {
            var c = new List<Claim>();

            c.Add(new Claim(CustomClaimTypes.StormPermission, Permissions.Dashboard.View));

            c.Add(new Claim(CustomClaimTypes.StormPermission, Permissions.Role.View));
            c.Add(new Claim(CustomClaimTypes.StormPermission, Permissions.Role.Create));
            c.Add(new Claim(CustomClaimTypes.StormPermission, Permissions.Role.Edit));
            c.Add(new Claim(CustomClaimTypes.StormPermission, Permissions.Role.Delete));

            c.Add(new Claim(CustomClaimTypes.StormPermission, Permissions.User.View));

            return c;
        }

        public static class CustomClaimTypes
        {
            public static string StormPermission = "urn:storm:permission";
        }

        public static class Permissions
        {
            public static class Dashboard
            {
                public const string View = "Permissions.Dashboard.View";
            }

            public static class Role
            {
                public const string View = "Permissions.Role.View";
                public const string Create = "Permissions.Role.Create";
                public const string Edit = "Permissions.Role.Edit";
                public const string Delete = "Permissions.Role.Delete";
            }

            public static class User
            {
                public const string View = "Permissions.User.View";
            }
        }
    }
}
