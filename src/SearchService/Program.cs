using MassTransit;
using SearchService.Consumers;
using SearchService.Data;
using SearchService.RequestHelpers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddMassTransit(x => {
    x.AddConsumer<AuctionCreatedConsumer>();
    x.AddConsumer<AuctionUpdatedConsumer>();
    x.AddConsumer<AuctionDeletedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));

    x.UsingRabbitMq((ctx, cfg) => {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], h => {
                h.Username(builder.Configuration["RabbitMQ:Username"]);
                h.Password(builder.Configuration["RabbitMQ:Password"]);
            }
        );
        cfg.ReceiveEndpoint("search-auction-created", e => {
            e.UseMessageRetry(r => r.Interval(5, 5));
            e.ConfigureConsumer<AuctionCreatedConsumer>(ctx);
        });
        cfg.ConfigureEndpoints(ctx);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

try {
    await DbInitializer.InitDb(app);
} catch (Exception e) {
    Console.WriteLine(e);
}

app.Run();