using System;
namespace RainstormTech.Models.DTO
{
    public class BaseTrackedDTO
    {
        public Guid CreatedUserId { get; set; }
        public string CreatedUserName { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public Guid? ModifiedUserId { get; set; }
        public string ModifiedUserName { get; set; }
        public DateTime? ModifiedDateTime { get; set; }
        public string CreatedUserEmail { get; set; }
        public string ModifiedUserEmail { get; set; }
    }
}
