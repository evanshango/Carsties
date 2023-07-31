using AuctionService.Consumers;
using AuctionService.Data;
using AuctionService.RequestHelpers;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(opt => {
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddMassTransit(x => {
    x.AddEntityFrameworkOutbox<AuctionDbContext>(opt => {
        opt.QueryDelay = TimeSpan.FromSeconds(10);
        opt.UsePostgres();
        opt.UseBusOutbox();
    });
    x.AddConsumer<AuctionCreatedFaultConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));
    x.UsingRabbitMq((ctx, cfg) => {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], h => {
                h.Username(builder.Configuration["RabbitMQ:Username"]);
                h.Password(builder.Configuration["RabbitMQ:Password"]);
            }
        );
        cfg.ConfigureEndpoints(ctx);
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => {
        opt.Authority = builder.Configuration["IdentityServiceUrl"];
        opt.RequireHttpsMetadata = false;
        opt.TokenValidationParameters.ValidateAudience = false;
        opt.TokenValidationParameters.NameClaimType = "username";
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

try {
    DbInitializer.InitDb(app);
} catch (Exception e) {
    Console.WriteLine(e);
}

app.Run();