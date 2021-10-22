using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using RainstormTech.Models;
using RainstormTech.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RainstormTech.Models.Identity;
using RainstormTech.Data.Data;
using Microsoft.Extensions.Logging;
using RainstormTech.Services.Interfaces;
using static RainstormTech.Models.ContactPropertyDTO;

namespace RainstormTech.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : BaseController
    {
        #region Constructor
        private IUserService _userService;

        public UserController(
            UserManager<ApplicationUser> userManager,
            ILogger<UserController> logger,
            IConfiguration configuration,
            IMapper mapper,
            ApplicationContext context,
            IUserService us) : base(userManager, context, mapper, logger, configuration)
        {
            _userService = us;
        }
        #endregion

        #region Crud
        /// <summary>
        /// Searches for users
        /// </summary>
        /// <param name="req"></param>
        /// <returns>Returns a paged list of matching users</returns>
        [HttpGet]
        public ActionResult Get([FromQuery] UserSearchInput req) =>
            Respond(_userService.SearchUsers(req));

        // GET api/user/5        
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(Guid id) =>
            Respond(await _userService.GetUser(id));

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserInput dto) =>
            Respond(await _userService.AddUser(dto));

        // PUT api/user/5        
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] UserSimpleDTO dto) =>
            Respond(await _userService.UpdateUser(id, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id) =>
            Respond(await _userService.DeleteUser(id));

        [HttpPut("{id}/restore")]
        public async Task<IActionResult> UnDeleteUser(string id) =>
            Respond(await _userService.UnDeleteUser(id));

        #endregion

        #region Password
        [HttpPut("{userid}/password")]
        public async Task<IActionResult> UpdatePassword(string userid, [FromBody] PasswordChangeInput o) =>
            Respond(await _userService.UpdatePassword(userid, o));

        #endregion

        #region Roles

        // GET api/user/5/roles
        [HttpGet("{userid}/roles")]
        public ActionResult GetUserRoles(Guid userid) =>
            Respond(_userService.GetUserRoles(userid));

        [HttpPost("{userid}/role")]
        public async Task<ActionResult> AddRoleToUser(Guid userid, [FromBody] UserRoleInput req) =>
            Respond(await _userService.AddRoleToUser(userid, req));


        [HttpDelete("{userid}/role/{roleid}")]
        public async Task<ActionResult> DeleteRoleFromUser(Guid userid, Guid roleid) =>
            Respond(await _userService.DeleteRoleFromUser(userid, roleid));

        #endregion
    }
}
