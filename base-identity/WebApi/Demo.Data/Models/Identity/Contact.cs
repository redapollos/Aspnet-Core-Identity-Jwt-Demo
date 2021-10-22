using RainstormTech.Data.Models.BaseModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RainstormTech.Models.Identity
{
    public class Contact : BaseTrackedByModel
    {
        [MaxLength(300)]
        public string Title { get; set; }
        [MaxLength(100)]
        public string FirstName { get; set; }
        [MaxLength(100)]
        public string LastName { get; set; }
        [MaxLength(300)]
        public string Email { get; set; }
        [MaxLength(500)]
        public string WebsiteUrl { get; set; }
        [MaxLength(30)]
        public string PhoneNumber { get; set; }

        public bool IsDeleted { get; set; }
    }
}
