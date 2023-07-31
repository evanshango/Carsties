﻿using System.Security.Claims;
using IdentityModel;
using IdentityService.Data;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace IdentityService;

public class SeedData {
    public static void EnsureSeedData(WebApplication app) {
        using var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
        var context = scope.ServiceProvider.GetService<AppDbContext>();
        context.Database.Migrate();

        var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        
        if(userMgr.Users.Any()) return;
        
        var alice = userMgr.FindByNameAsync("alice").Result;
        if (alice == null) {
            alice = new AppUser {
                UserName = "alice",
                Email = "AliceSmith@email.com",
                EmailConfirmed = true,
            };
            var result = userMgr.CreateAsync(alice, "Pass123$").Result;
            if (!result.Succeeded) {
                throw new Exception(result.Errors.First().Description);
            }

            result = userMgr.AddClaimsAsync(alice, new[] {
                new Claim(JwtClaimTypes.Name, "Alice Smith"),
            }).Result;
            
            if (!result.Succeeded) {
                throw new Exception(result.Errors.First().Description);
            }

            Log.Debug("alice created");
        } else {
            Log.Debug("alice already exists");
        }

        var bob = userMgr.FindByNameAsync("bob").Result;
        if (bob == null) {
            bob = new AppUser {
                UserName = "bob",
                Email = "BobSmith@email.com",
                EmailConfirmed = true
            };
            var result = userMgr.CreateAsync(bob, "Pass123$").Result;
            if (!result.Succeeded) {
                throw new Exception(result.Errors.First().Description);
            }

            result = userMgr.AddClaimsAsync(bob, new Claim[] {
                new(JwtClaimTypes.Name, "Bob Smith"),
            }).Result;
            if (!result.Succeeded) {
                throw new Exception(result.Errors.First().Description);
            }

            Log.Debug("bob created");
        } else {
            Log.Debug("bob already exists");
        }
    }
}