using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static RainstormTech.Data.Components.Enums;

namespace RainstormTech.Models
{
    public class GenericResponse
    {
        public ServiceStatus Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public IEnumerable<IdentityError> Errors { get; set; }

        public virtual GenericResponse BadRequest(string msg)
        {
            Status = ServiceStatus.BadRequest;
            Message = msg;
            return this;
        }

        public virtual GenericResponse BadRequest(IEnumerable<IdentityError> errs)
        {
            Status = ServiceStatus.BadRequest;
            Message = "error";
            Errors = errs;
            return this;
        }

        public virtual GenericResponse NotFound(string msg)
        {
            Status = ServiceStatus.NotFound;
            Message = msg;
            return this;
        }

        public virtual GenericResponse Ok(string msg = "")
        {
            Status = ServiceStatus.Ok;
            Message = msg;
            return this;
        }
    }

    public class ServiceResponse<T> : GenericResponse
    {
        public T Data { get; set; }

        public override ServiceResponse<T> BadRequest(string msg)
        {
            Status = ServiceStatus.BadRequest;
            Message = msg;
            return this;
        }

        public override ServiceResponse<T> BadRequest(IEnumerable<IdentityError> errs)
        {
            Status = ServiceStatus.BadRequest;
            Message = "error";
            Errors = errs;
            return this;
        }

        public ServiceResponse<T> NotFound(string msg)
        {
            Status = ServiceStatus.NotFound;
            Message = msg;
            return this;
        }

        public ServiceResponse<T> Ok(string msg = "")
        {
            Status = ServiceStatus.Ok;
            Message = msg;
            Data = default(T);
            return this;
        }

        public ServiceResponse<T> Ok(T d, string msg = "")
        {
            Status = ServiceStatus.Ok;
            Message = msg;
            Data = d;
            return this;
        }
    }
}
