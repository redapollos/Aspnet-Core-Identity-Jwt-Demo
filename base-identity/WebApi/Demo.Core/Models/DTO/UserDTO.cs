using RainstormTech.Models.DTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using static RainstormTech.Data.Components.Enums;

namespace RainstormTech.Models
{
    public class UserSimpleDTO
    {
        // basic user props
        public Guid Id { get; set; }
        public Guid ContactId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string ThumbnailUrl { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class UserDTO : UserSimpleDTO
    {
        public ICollection<UserRoleDTO> UserRoles { get; set; }

        // jwt token
        public string Token { get; set; }
        public ICollection<string> Claims { get; internal set; }
    }

    public class UserSearchDTO : BaseSearchDTO
    {
        public List<UserDTO> Users { get; set; } = new List<UserDTO>();
    }

    public class UserSearchInput
    {
        public string keyword { get; set; } = "";
        public Guid? roleid { get; set; } = Guid.Empty;
        public int? page { get; set; } = 1;
        public int? pagesize { get; set; } = 30;
        public string sort { get; set; }
        public bool desc { get; set; }
    }

    public class UserRoleDTO
    {
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }

        public string RoleName { get; set; }
        public string RoleNormalizedName { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    public class ContactPropertyDTO
    {
        public Guid? Id { get; set; }
        public Guid ContactId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }

        #region Account Management

        public class UserInput : UserSimpleDTO
        {
            public string Password { get; set; }
            public bool SendEmail { get; set; }
            public Guid? AppId { get; set; }
            public int? SubscriptionTypeId { get; set; }
        }

        public class ConfirmInput
        {
            public Guid UserId { get; set; }
            public string EmailToken { get; set; }
            public string PasswordToken { get; set; }
            public string Password { get; set; }
        }

        public class PasswordChangeInput
        {
            public Guid UserId { get; set; }
            public string Password { get; set; }
        }

        public class Login
        {
            [Required(ErrorMessage = "User Name is required")]
            public string Username { get; set; }

            [Required(ErrorMessage = "Password is required")]
            public string Password { get; set; }
        }
        #endregion
    }
}
