using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace RainstormTech.Models.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {                
        public DateTime CreatedOn { get; set; }
        public DateTime? LastLoginOn { get; set; }
        public bool IsDeleted { get; set; }
        public Guid ContactId { get; set; }

        public virtual Contact Contact { get; set; }

        public virtual ICollection<ApplicationUserClaim> Claims { get; set; }
        public virtual ICollection<ApplicationUserLogin> Logins { get; set; }
        public virtual ICollection<ApplicationUserToken> Tokens { get; set; }
        public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }        
    }
}
