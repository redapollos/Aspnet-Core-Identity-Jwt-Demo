using RainstormTech.Models;
using RainstormTech.Models.Identity;
using System;
using System.Linq;
using System.Threading.Tasks;
using static RainstormTech.Models.ContactPropertyDTO;

namespace RainstormTech.Services.Interfaces
{
    public interface IAuthenticationService
    {
        Task<ServiceResponse<UserDTO>> Login(Login model);
        Task<ServiceResponse<UserDTO>> ConfirmEmail(ConfirmInput model);
        Task<ServiceResponse<UserDTO>> ConfirmPassword(ConfirmInput model);
        Task<GenericResponse> ResetPassword(string email);
    }
}
