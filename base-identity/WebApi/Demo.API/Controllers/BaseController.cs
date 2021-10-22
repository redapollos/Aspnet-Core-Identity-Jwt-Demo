
using Microsoft.AspNetCore.Mvc;
using System;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using RainstormTech.Models.Identity;
using RainstormTech.Data.Data;
using System.Security.Claims;
using System.Threading.Tasks;
using TimeZoneConverter;
using Microsoft.Extensions.Configuration;
using RainstormTech.Models.DTO;
using System.Collections.Generic;
using System.Linq;
using RainstormTech.Components;
using RainstormTech.Models;
using static RainstormTech.Data.Components.Enums;

namespace RainstormTech.Controllers
{
    public class BaseController : ControllerBase
    {
        public const string AdministratorUser = "ADMINISTRATOR";

        // define db context
        protected UserManager<ApplicationUser> userManager;
        protected ApplicationContext db { get; set; }
        protected IMapper mapper { get; set; }
        protected Microsoft.Extensions.Logging.ILogger log;
        protected IConfiguration config;

        public BaseController(UserManager<ApplicationUser> u, ApplicationContext dbContext, IMapper m, Microsoft.Extensions.Logging.ILogger logger = null, IConfiguration configuration = null)
        {
            this.userManager = u;
            this.db = dbContext;
            this.mapper = m;
            this.log = logger;
            this.config = configuration;
        }

        /// <summary>
        /// Create the ActionResult response based on the underlying response from the service layer
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="r"></param>
        /// <returns></returns>
        protected ActionResult Respond<T>(ServiceResponse<T> r)
        {
            if (r.Status == ServiceStatus.Ok)
                return Ok(r.Data);

            if (r.Status == ServiceStatus.BadRequest)
                return BadRequest(r.Message);

            return NotFound(r.Message);
        }

        /// <summary>
        /// Create the ActionResult response based on the underlying response from the service layer
        /// </summary>
        /// <param name="r"></param>
        /// <returns></returns>
        protected ActionResult Respond(GenericResponse r)
        {
            if (r.Status == ServiceStatus.Ok)
                return Ok();

            if (r.Status == ServiceStatus.BadRequest)
                return BadRequest(r.Message);

            return NotFound(r.Message);
        }
    }
}
