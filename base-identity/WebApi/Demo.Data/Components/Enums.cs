using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RainstormTech.Data.Components
{
    public class Enums
    {
        public enum Comparison
        {
            GreaterThan,
            GreaterThanOrEqual,
            Equal,
            LessThan,
            LessThanOrEqual,
            NotEqual
        }

        public enum ServiceStatus
        {
            Ok,
            BadRequest,
            NotFound
        }
    }
}
