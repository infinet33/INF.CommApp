using INF.CommApp.BLL.Interfaces;
using INF.CommApp.DATA.Models;
using Microsoft.AspNetCore.Mvc;

namespace INF.CommApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;

        public UserController(IUserService userService, INotificationService notificationService)
        {
            _userService = userService;
            _notificationService = notificationService;
        }

        public class CreateUserDto
        {
            public string UserName { get; set; }
            public string Type { get; set; }
            public Guid? AgencyExtId { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                User user = await _userService.CreateUserAsync(
                    createUserDto.UserName, 
                    createUserDto.Type, 
                    createUserDto.AgencyExtId);

                return CreatedAtAction(nameof(GetUser), new { id = user.ExternalId }, user);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            User? user = await _userService.GetUserByExternalIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        public class UpdateUserDto
        {
            public string UserName { get; set; }
            public string Type { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                await _userService.UpdateUserAsync(id, updateUserDto.UserName, updateUserDto.Type);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        public class CreateNotificationDto
        {
            public Guid ResidentExtId { get; set; }
            public string Message { get; set; }
            public NotificationPriority Priority { get; set; } = NotificationPriority.General;
        }

        [HttpPost("{id}/notifications")]
        public async Task<IActionResult> CreateNotificationForResident(Guid id, [FromBody] CreateNotificationDto createNotificationDto)
        {
            try
            {
                Notification notification = await _notificationService.CreateNotificationForResidentAsync(
                    id, 
                    createNotificationDto.ResidentExtId, 
                    createNotificationDto.Message, 
                    createNotificationDto.Priority);

                return CreatedAtAction("GetNotification", "Notification", new { id = notification.ExternalId }, notification);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/residents/{residentExtId}/request-access")]
        public async Task<IActionResult> RequestAccessToResident(Guid id, Guid residentExtId)
        {
            try
            {
                bool accessGranted = await _userService.RequestAccessToResidentAsync(id, residentExtId);
                
                if (!accessGranted)
                {
                    return Conflict(new { message = "Access already exists" });
                }

                return Ok(new { message = "Access requested/created" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{id}/residents")]
        public async Task<IActionResult> GetUserResidents(Guid id)
        {
            try
            {
                IEnumerable<Resident> residentList = await _userService.GetUserResidentsAsync(id);
                return Ok(residentList);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
