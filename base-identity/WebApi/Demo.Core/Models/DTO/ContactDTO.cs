using RainstormTech.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static RainstormTech.Data.Components.Enums;

namespace RainstormTech.Models.DTO
{
    public class ContactSimpleDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string ThumbnailUrl { get; set; }
        public string WebsiteUrl { get; set; }
        public bool IsDeleted { get; set; }
        public string DisplayName => $"{FirstName} {LastName}"; // make this an option as some point
    }

    public class ContactDTO : ContactSimpleDTO
    {
        public Guid CreatedBy { get; set; }
        public Guid UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
    }


    public class ContactSearchDTO : BaseSearchDTO
    {
        public List<ContactSimpleDTO> Contacts { get; set; } = new List<ContactSimpleDTO>();
    }
}
