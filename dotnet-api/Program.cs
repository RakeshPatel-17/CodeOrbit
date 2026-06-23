using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using NetApi.Data;
using NetApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://orbit-property-api.fly.dev")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 1. Configure EF Core with Neon PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Need IHttpContextAccessor to get the User claims in the DbContext for the TenantId filter
builder.Services.AddHttpContextAccessor();

// 2. Configure Clerk Authentication Middleware
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Clerk:Authority"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Clerk:ValidIssuer"],
            ValidateAudience = false,
            ValidateLifetime = true,
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = "role"
        };
        
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var principal = context.Principal;
                if (principal != null && principal.Identity is ClaimsIdentity identity)
                {
                    var roleClaim = principal.FindFirst("org_role");
                    if (roleClaim != null)
                    {
                        identity.AddClaim(new Claim(ClaimTypes.Role, roleClaim.Value));
                    }
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// 3. Configure Cloudflare R2 / AWS S3 SDK
builder.Services.Configure<CloudflareR2Settings>(builder.Configuration.GetSection("CloudflareR2"));
builder.Services.AddSingleton<R2StorageService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();