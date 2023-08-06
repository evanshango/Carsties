using MassTransit;
using NotificationService.Consumers;
using NotificationService.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMassTransit(x => {
    x.AddConsumer<AuctionCreatedConsumer>();
    x.AddConsumer<AuctionFinishedConsumer>();
    x.AddConsumer<BidPlacedConsumer>();
    
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("notify", false));
    x.UsingRabbitMq((ctx, cfg) => {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], "/", h => {
                h.Username(builder.Configuration.GetValue("RabbitMQ:Username", "guest"));
                h.Username(builder.Configuration.GetValue("RabbitMQ:Password", "guest"));
            }
        );
        cfg.ConfigureEndpoints(ctx);
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<NotificationHub>("/notifications");

app.Run();