using RainstormTech.Models;
using RainstormTech.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RainstormTech.Services.Interfaces
{
    public interface IRoleService
    {
        ServiceResponse<List<RoleDTO>> GetAll();
        Task<ServiceResponse<RoleDTO>> Get(Guid id);
        Task<ServiceResponse<Guid>> Add(RoleDTO role);
        Task<GenericResponse> Update(Guid id, RoleDTO role);
        Task<GenericResponse> DeleteRole(Guid roleid);
        ServiceResponse<List<ClaimDTO>> GetClaims();
        Task<GenericResponse> UpdateClaims(Guid roleid, List<string> claimValues);
    }
}
