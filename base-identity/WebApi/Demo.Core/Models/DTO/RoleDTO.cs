using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RainstormTech.Models.DTO
{
    public class RoleDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public int Quantity { get; set; }

        public List<ClaimDTO> Claims { get; set; } = new List<ClaimDTO>();

    }

    public class ClaimDTO
    {
        public string Type { get; set; }
        public string Value { get; set; }
        public string Label => Value.Replace("Permissions.", "").Replace(".", " ");
    }

    public class UserRoleInput
    {
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
        public DateTime? StartDate { get; set; } = DateTime.MinValue;
        public DateTime? ExpiryDate { get; set; } = DateTime.MaxValue;
    }
}
