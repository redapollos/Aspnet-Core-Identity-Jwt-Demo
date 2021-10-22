using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RainstormTech.API.Components
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public int TokenExpirationInDays { get; set; }
    }
}
