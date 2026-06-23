using Microsoft.AspNetCore.Mvc;
using Svix;
using System.Net;

namespace NetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebhooksController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public WebhooksController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("clerk")]
        public async Task<IActionResult> ClerkWebhook()
        {
            // The Clerk Webhook Secret from the Dashboard
            var secret = _configuration["Clerk:WebhookSecret"];
            if (string.IsNullOrEmpty(secret))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Webhook secret not configured.");
            }

            // Get headers required by Svix
            var headers = new WebHeaderCollection();
            foreach (var header in Request.Headers)
            {
                headers.Add(header.Key, header.Value.ToString());
            }

            // Read the raw body
            using var reader = new StreamReader(Request.Body);
            var payload = await reader.ReadToEndAsync();

            try
            {
                var wh = new Webhook(secret);
                // Verify the webhook signature
                wh.Verify(payload, headers);

                // If verified, process the event...
                // e.g. User created, organization created, etc.
                Console.WriteLine("Webhook verified! Payload: " + payload);

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}