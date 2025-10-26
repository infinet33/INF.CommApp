using INF.CommApp.DATA.Models;
using INF.CommApp.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace INF.CommApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacilityController : ControllerBase
    {
        private readonly IFacilityService _facilityService;
        private readonly IResidentService _residentService;
        private readonly IUserService _userService;

        public FacilityController(
            IFacilityService facilityService,
            IResidentService residentService,
            IUserService userService)
        {
            _facilityService = facilityService;
            _residentService = residentService;
            _userService = userService;
        }

        public class FacilityDto
        {
            public string Name { get; set; }
            public string Address { get; set; }
            public string City { get; set; }
            public string State { get; set; }
            public string Zip { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CreateFacility([FromBody] FacilityDto facilityDto)
        {
            try
            {
                Facility facility = await _facilityService.CreateFacilityAsync(
                    facilityDto.Name,
                    facilityDto.Address,
                    facilityDto.City,
                    facilityDto.State,
                    facilityDto.Zip);

                return CreatedAtAction(nameof(GetFacility), new { id = facility.ExternalId }, facility);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFacility(Guid id)
        {
            Facility? facility = await _facilityService.GetFacilityByExternalIdAsync(id);
            
            if (facility == null)
            {
                return NotFound();
            }

            return Ok(facility);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFacility(Guid id, [FromBody] FacilityDto facilityDto)
        {
            try
            {
                Facility facility = await _facilityService.UpdateFacilityAsync(
                    id,
                    facilityDto.Name,
                    facilityDto.Address,
                    facilityDto.City,
                    facilityDto.State,
                    facilityDto.Zip);

                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        public class ResidentDto
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
        }

        [HttpPost("{facilityExtId}/residents")]
        public async Task<IActionResult> AddResident(Guid facilityExtId, [FromBody] ResidentDto residentDto)
        {
            try
            {
                Resident resident = await _facilityService.AddResidentToFacilityAsync(
                    facilityExtId,
                    residentDto.FirstName,
                    residentDto.LastName);

                return CreatedAtAction(nameof(GetResident), new { facilityExtId = facilityExtId, residentExtId = resident.ExternalId }, resident);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{facilityExtId}/residents/{residentExtId}")]
        public async Task<IActionResult> GetResident(Guid facilityExtId, Guid residentExtId)
        {
            Resident? resident = await _facilityService.GetResidentAsync(facilityExtId, residentExtId);
            
            if (resident == null)
            {
                return NotFound();
            }

            return Ok(resident);
        }

        [HttpPut("{facilityExtId}/residents/{residentExtId}")]
        public async Task<IActionResult> UpdateResident(Guid facilityExtId, Guid residentExtId, [FromBody] ResidentDto residentDto)
        {
            try
            {
                Resident resident = await _facilityService.UpdateResidentAsync(
                    facilityExtId,
                    residentExtId,
                    residentDto.FirstName,
                    residentDto.LastName);

                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        public class StaffDto
        {
            public string UserName { get; set; }
            public string Type { get; set; }
            public Guid? AgencyExtId { get; set; }
        }

        [HttpPost("{facilityExtId}/staff")]
        public async Task<IActionResult> AddStaff(Guid facilityExtId, [FromBody] StaffDto staffDto)
        {
            try
            {
                User user = await _facilityService.AddStaffToFacilityAsync(
                    facilityExtId,
                    staffDto.UserName,
                    staffDto.Type,
                    staffDto.AgencyExtId);

                return CreatedAtAction(nameof(GetUser), "User", new { id = user.ExternalId }, user);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [NonAction]
        public async Task<IActionResult> GetUser(Guid id)
        {
            User? user = await _userService.GetUserByExternalIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}
