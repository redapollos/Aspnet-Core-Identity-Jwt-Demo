using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RainstormTech.Models.Identity;

namespace RainstormTech.Data.Models.BaseModels
{
    public class BaseTrackedByModel : BaseTrackedModel
    {        
        [Required]
        public Guid CreatedBy { get; set; }
        public Guid? UpdatedBy { get; set; }
    }
}
