using Microsoft.AspNetCore.Mvc;
using RectangleApi.Models;
using System.Text.Json;

namespace RectangleApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RectangleController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private static readonly object _fileLock = new();

        public RectangleController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // GET: api/Rectangle
        [HttpGet]
        public IActionResult Get()
        {
            var path = Path.Combine(_env.ContentRootPath, "Data/dimensions.json");
            if (!System.IO.File.Exists(path))
                return NotFound("Dimensions file not found.");

            lock (_fileLock)
            {
                var json = System.IO.File.ReadAllText(path);
                return Ok(json);
            }
        }

        // POST: api/Rectangle
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RectangleDimensions dimensions)
        {
            // Simulate 10-second backend validation delay
            await Task.Delay(10000);

            if (dimensions.Width > dimensions.Height)
                return BadRequest("Width cannot exceed height.");

            var path = Path.Combine(_env.ContentRootPath, "Data/dimensions.json");
            lock (_fileLock)
            {
                System.IO.File.WriteAllText(path, JsonSerializer.Serialize(dimensions));
            }

            return Ok(dimensions);
        }
    }
}