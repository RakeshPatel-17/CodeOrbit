using NetApi.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ResidentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResidentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetResidents()
        {
            var residents = _context.Residents.Select(r => new {
                id = r.Id.ToString(),
                name = r.Name,
                unit = r.Unit,
                status = r.Status,
                balance = r.Balance
            }).ToList();
            return Ok(residents);
        }
    }
}