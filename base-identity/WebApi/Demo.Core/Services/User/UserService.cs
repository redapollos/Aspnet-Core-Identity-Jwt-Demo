using RainstormTech.Data.Data;
using RainstormTech.Models;
using RainstormTech.Models.Identity;
using RainstormTech.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RainstormTech.Models.DTO;
using Microsoft.EntityFrameworkCore;
using RainstormTech.Helpers;
using AutoMapper;
using System.Security.Claims;
using static RainstormTech.Models.ContactPropertyDTO;
using RainstormTech.Components;
using RainstormTech.Services.Base;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace RainstormTech.Services.User
{
    public class UserService : BaseService, IUserService
    {
        protected RoleManager<ApplicationRole> _roleManager;

        public UserService(IConfiguration configuration, 
            ApplicationContext context, 
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IMapper mapper,
            ILogger<UserService> logger,
            IHttpContextAccessor hca) : base(userManager, context, mapper, hca, logger, configuration)
        {
            _roleManager = roleManager;
        }

        #region User Related
        #region Crud
        /// <summary>
        /// Searches for users
        /// </summary>
        /// <param name="req"></param>
        /// <returns>Returns a paged list of matching users</returns>
        /// 
        public ServiceResponse<UserSearchDTO> SearchUsers(UserSearchInput req)
        {
            var r = new ServiceResponse<UserSearchDTO>();

            // define the return object
            var res = new UserSearchDTO();
            res.Page = (int)req.page;
            res.PageSize = (int)req.pagesize;

            // ensure some values
            if (string.IsNullOrEmpty(req.sort))
                req.sort = "lastName";

            // query the users            
            var list = db.Users
                        .Include(o => o.Contact)
                        .Include(o => o.UserRoles)
                            .ThenInclude(o => o.Role)
                        .AsQueryable();
            //.Where(o => o.Id != null);

            if (!string.IsNullOrEmpty(req.keyword))
            {
                req.keyword = req.keyword.ToLower();

                list = list.Where(o => (
                    o.UserName.ToLower().Contains(req.keyword) ||
                    o.Contact.FirstName.ToLower().Contains(req.keyword) ||
                    o.Contact.LastName.ToLower().Contains(req.keyword) ||
                    o.Email.ToLower().Contains(req.keyword)
                ));
            }

            if (req.roleid != Guid.Empty)
                list = list.Where(o => o.UserRoles.Any(r => r.RoleId == req.roleid));

            switch (req.sort.ToLower())
            {
                case "username":
                    if (req.desc)
                        list = list.OrderByDescending(o => o.UserName);
                    else
                        list = list.OrderBy(o => o.UserName);
                    break;
                case "firstname":
                    if (req.desc)
                        list = list.OrderByDescending(o => o.Contact.FirstName);
                    else
                        list = list.OrderBy(o => o.Contact.FirstName);
                    break;
                case "email":
                    if (req.desc)
                        list = list.OrderByDescending(o => o.Email);
                    else
                        list = list.OrderBy(o => o.Email);
                    break;
                default: // lastname
                    if (req.desc)
                        list = list.OrderByDescending(o => o.Contact.LastName);
                    else
                        list = list.OrderBy(o => o.Contact.LastName);
                    break;
            }

            var all = list.Skip(((int)req.page - 1) * (int)req.pagesize).Take((int)req.pagesize).ToList();

            // convert to DTOs
            res.Users = mapper.Map<IEnumerable<UserDTO>>(all).ToList();

            // get the count from another query
            var u = db.Users.AsQueryable();

            if (!string.IsNullOrEmpty(req.keyword))
            {
                req.keyword = req.keyword.ToLower();

                u = u.Where(o => (
                    o.Contact.FirstName.ToLower().Contains(req.keyword) ||
                    o.Contact.LastName.ToLower().Contains(req.keyword) ||
                    o.Email.ToLower().Contains(req.keyword)
                ));
            }

            if (req.roleid != Guid.Empty)
                u = u.Where(o => o.UserRoles.Any(r => r.RoleId == req.roleid));

            res.TotalRecords = u.Count();

            return r.Ok(res);
        }


        public async Task<ServiceResponse<UserDTO>> GetSelf()
        {
            var r = new ServiceResponse<UserDTO>();

            try
            {
                // var username = HttpContext.User.Claims.FirstOrDefault(o => o.Type == "sub")?.Value;
                var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                if (userId == null)
                    return r.NotFound("user not found");

                // gets the logged in user
                var u = await userManager.Users
                                .Include(o => o.Contact)
                                .FirstOrDefaultAsync(o => o.Id == userId.ToGuid());

                if (u == null)
                    return r.NotFound("user not found");

                // get user roles
                u.UserRoles = db.UserRoles
                                .Include(o => o.Role)
                                .Where(o => o.UserId == u.Id).ToList();

                var dto = mapper.Map<UserDTO>(u);

                return r.Ok(dto);
            }
            catch (Exception ex)
            {
                return r.BadRequest(ex.Message);
            }
        }


        public async Task<ServiceResponse<Guid>> AddUser(UserInput dto)
        {
            var r = new ServiceResponse<Guid>();

            try
            {
                var u = mapper.Map<ApplicationUser>(dto);
                u.PhoneNumber = u.PhoneNumber.ToPhone();
                u.CreatedOn = DateTime.UtcNow;

                var needsPassword = string.IsNullOrEmpty(dto.Password);

                // if we're not asking for a password, make one on the fly
                if (needsPassword)
                    dto.Password = SecurityHelper.GeneratePassword();

                var res = await userManager.CreateAsync(u, dto.Password);

                if (!res.Succeeded)
                    return r.BadRequest(res.Errors);

                db.SaveChanges();

                return r.Ok();
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message, ex);
                return r.BadRequest(ex.Message);
            }
        }


        public async Task<ServiceResponse<UserSimpleDTO>> UpdateUser(string id, UserSimpleDTO dto)
        {
            var r = new ServiceResponse<UserSimpleDTO>();
            try
            {
                // get the user
                var u = await userManager.Users
                                .Include(o => o.Contact)
                                .FirstOrDefaultAsync(o => o.Id == id.ToGuid());

                if (u == null)
                    return r.NotFound("User Not Found");

                // update username
                var unRes = await userManager.SetUserNameAsync(u, dto.UserName);

                if (!unRes.Succeeded)
                    return r.BadRequest(unRes.Errors);

                // update fields
                u.Contact.FirstName = dto.FirstName;
                u.Contact.LastName = dto.LastName;
                u.Contact.Email = dto.Email;
                u.PhoneNumber = dto.PhoneNumber.ToPhone();
                u.Email = dto.Email;


                // save user
                var res = await userManager.UpdateAsync(u);

                if (!res.Succeeded)
                    return r.BadRequest(res.Errors);

                // reget the user with all the stuff
                u = await userManager.FindByIdAsync(id);
                dto = mapper.Map<UserSimpleDTO>(u);
                return r.Ok(dto);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message, ex);
                return r.BadRequest(ex.Message);
            }
        }

        public async Task<GenericResponse> DeleteUser(string id)
        {
            var r = new GenericResponse();

            // get the user
            var u = await userManager.FindByIdAsync(id);

            if (u == null)
                return r.NotFound("User Not Found");

            // soft delete the user
            u.IsDeleted = true;
            db.Users.Update(u);
            db.SaveChanges();

            return r.Ok();
        }


        public async Task<GenericResponse> UnDeleteUser(string id)
        {
            var r = new GenericResponse();

            // get the user
            var u = await userManager.FindByIdAsync(id);

            if (u == null)
                return r.NotFound("User Not Found");

            // soft delete the user
            u.IsDeleted = false;
            db.Users.Update(u);
            db.SaveChanges();

            return r.Ok();
        }
        #endregion

        #region Password

        public async Task<GenericResponse> UpdatePassword(string userid, PasswordChangeInput o)
        {
            var r = new GenericResponse();

            try
            {
                // check the userid
                var u = await userManager.FindByIdAsync(userid.ToString());

                if (u == null)
                    return r.NotFound("user not found");

                var token = await userManager.GeneratePasswordResetTokenAsync(u);

                var result = await userManager.ResetPasswordAsync(u, token, o.Password);

                if (result.Succeeded)
                    return r.Ok();

                // if bad, return list of errors
                return r.BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                return r.BadRequest(ex.Message);
            }
        }
        #endregion

        #region Roles

        public ServiceResponse<IEnumerable<UserRoleDTO>> GetUserRoles(Guid userid)
        {
            var r = new ServiceResponse<IEnumerable<UserRoleDTO>>();

            var u = userManager.Users
                            .Include(o => o.UserRoles)
                                .ThenInclude(o => o.Role)
                            .FirstOrDefault(o => o.Id == userid);

            if (u == null)
                return r.NotFound("user not found");

            var dto = mapper.Map<IEnumerable<UserRoleDTO>>(u.UserRoles);

            return r.Ok(dto);
        }


        public async Task<GenericResponse> AddRoleToUser(Guid userid, UserRoleInput req)
        {
            var r = new GenericResponse();

            try
            {
                // look up user
                var u = await userManager.Users
                                .Include(o => o.UserRoles)
                                .ThenInclude(o => o.Role)
                                .FirstOrDefaultAsync(o => o.Id == userid);

                if (u == null)
                    return r.NotFound("user not found");

                // look up role
                var role = await _roleManager.FindByIdAsync(req.RoleId.ToString());

                if (role == null)
                    return r.NotFound("role not found");

                // see if they already have the role
                var ur = u.UserRoles.FirstOrDefault(o => o.RoleId == req.RoleId);
                var dtStart = req.StartDate == null ? "null" : $"'{req.StartDate.ToString()}'";
                var dtExpiry = req.ExpiryDate == null ? "null" : $"'{req.ExpiryDate.ToString()}'";

                if (ur == null) // add
                {
                    var sql = $"INSERT INTO dbo.AspNetUserRoles (userid, roleid, startdate, expirydate) VALUES ('{req.UserId}', '{req.RoleId}', {dtStart}, {dtExpiry})";
                    db.Database.ExecuteSqlRaw(sql);
                    /*var newUr = new ApplicationUserRole
                    {
                        RoleId = req.RoleId,
                        StartDate = req.StartDate,
                        ExpiryDate = req.ExpiryDate,
                        UserId = req.UserId
                    };
                    db.ApplicationUserRoles.Add(newUr);
                    db.SaveChanges();
                    */
                }
                else // update
                {
                    var sql = $"UPDATE dbo.AspNetUserRoles SET StartDate = {dtStart}, ExpiryDate = {dtExpiry} WHERE roleid = '{ur.RoleId}' AND userid = '{ur.UserId}'";
                    db.Database.ExecuteSqlRaw(sql);
                    /*
                    ur.StartDate = req.StartDate;
                    ur.ExpiryDate = req.ExpiryDate;
                    db.UserRoles.Update(ur);
                    db.SaveChanges();
                    */
                }

                return r.Ok();
            }
            catch (Exception ex)
            {
                return r.BadRequest(ex.Message);
            }
        }

        public async Task<GenericResponse> DeleteRoleFromUser(Guid userid, Guid roleid)
        {
            var r = new GenericResponse();

            // look up user
            var u = await userManager.FindByIdAsync(userid.ToString());

            if (u == null)
                return r.NotFound("user not found");

            // look up role
            var role = await _roleManager.FindByIdAsync(roleid.ToString());

            if (role == null)
                return r.NotFound("role not found");

            // see if they already have the role
            var result = await userManager.RemoveFromRoleAsync(u, role.Name);

            return r.Ok();
        }
        #endregion

        #endregion

        #region Contact Related
        /// <summary>
        /// Searches for users
        /// </summary>
        /// <param name="req"></param>
        /// <returns>Returns a paged list of matching users</returns>        
        public ServiceResponse<ContactSearchDTO> SearchContacts(BaseSearchInput req)
        {
            var r = new ServiceResponse<ContactSearchDTO>();

            if (req == null || req.Pagination == null)
                return r.BadRequest("Missing arguments");

            // define the return object
            var res = new ContactSearchDTO();
            res.Page = req.Pagination.PageNum;
            res.PageSize = req.Pagination.PageSize;

            if (req.OrderBy == null)
                req.OrderBy = new SearchOrderInput() { Id = "lastname", Desc = false };

            // query the contacts
            var list = db.Contact.Where(o => o.IsDeleted == false).AsQueryable();

            if (!string.IsNullOrEmpty(req.Keyword))
            {
                req.Keyword = req.Keyword.ToLower();

                list = list.Where(o => (
                    o.FirstName.ToLower().Contains(req.Keyword) ||
                    o.LastName.ToLower().Contains(req.Keyword) ||
                    o.Email.ToLower().Contains(req.Keyword)
                ));
            }

            switch (req.OrderBy.Id.ToLower())
            {
                case "firstname":
                    if (req.OrderBy.Desc)
                        list = list.OrderByDescending(o => o.FirstName);
                    else
                        list = list.OrderBy(o => o.FirstName);
                    break;
                case "email":
                    if (req.OrderBy.Desc)
                        list = list.OrderByDescending(o => o.Email);
                    else
                        list = list.OrderBy(o => o.Email);
                    break;
                default: // lastname
                    if (req.OrderBy.Desc)
                        list = list.OrderByDescending(o => o.LastName);
                    else
                        list = list.OrderBy(o => o.LastName);
                    break;
            }

            res.TotalRecords = list.Count();

            var all = list.Skip(((int)req.Pagination.PageNum - 1) * (int)req.Pagination.PageSize).Take((int)req.Pagination.PageSize).ToList();

            // convert to DTOs
            res.Contacts = mapper.Map<IEnumerable<ContactSimpleDTO>>(all).ToList();

            return r.Ok(res);
        }


        public async Task<ServiceResponse<UserSimpleDTO>> GetUser(Guid id)
        {
            var r = new ServiceResponse<UserSimpleDTO>();

            try
            {
                var u = await userManager.Users
                                .Include(o => o.Contact)
                                .FirstOrDefaultAsync(o => o.Id == id);

                if (u == null)
                    return r.NotFound("user not found");

                var dto = mapper.Map<UserSimpleDTO>(u);

                return r.Ok(dto);
            }
            catch (Exception ex)
            {
                return r.BadRequest(ex.Message);
            }
        }

        public GenericResponse UnDeleteContact(Guid id)
        {
            var r = new GenericResponse();

            // get the contact
            var u = db.Contact.FirstOrDefault(o => o.Id == id);

            if (u == null)
                return r.NotFound("Contact Not Found");

            // restore
            u.IsDeleted = false;
            db.Contact.Update(u);
            db.SaveChanges();

            return r.Ok();
        }
        #endregion

        public async Task<IList<Claim>> GetRoleClaimsAsync(IList<string> roles)
        {
            var roleClaims = new List<Claim>();
            foreach (var role in roles)
            {
                var aRole = await _roleManager.FindByNameAsync(role);
                if (string.Equals(role.ToLower(), AdministratorUser.ToLower(), StringComparison.InvariantCultureIgnoreCase))
                {
                    roleClaims.AddRange(RainstormTech.Api.Components.Authorization.SystemClaims.GetClaims());
                }
                roleClaims.AddRange(await _roleManager.GetClaimsAsync(aRole).ConfigureAwait(false));
            }
            return roleClaims;
        }
    }
}
