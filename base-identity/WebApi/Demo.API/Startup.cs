using System;
using System.Reflection;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using RainstormTech.Components;
using RainstormTech.Data.Data;
using RainstormTech.Models.Identity;
using RainstormTech.Services;
using Microsoft.OpenApi.Models;
using RainstormTech.Services.Interfaces;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using RainstormTech.API.Components;
using RainstormTech.Services.User;
using Microsoft.AspNetCore.Authorization;
using RainstormTech.Components.Authorization;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using RainstormTech.Services.CoreServices;
using RainstormTech.Helpers;

namespace RainstormTech
{
    public class Startup
    {

        public static IWebHostEnvironment AppEnvironment { get; private set; }
        public IConfiguration Configuration { get; }

        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            Configuration = configuration;
            AppEnvironment = env;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Application Insights
            //TODO: let's do this for prod and works only on windows app services
            services.AddApplicationInsightsTelemetry(Configuration);

            // enable caching
            services.AddMemoryCache();

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", 
                    new OpenApiInfo { 
                        Title = "Sweet System API", 
                        Version = "v1",
                        Description = "API for handling user/content data",
                        // TermsOfService = new Uri("https://example.com/terms"),
                        Contact = new OpenApiContact
                        {
                            Name = "Some Developer",
                            Email = string.Empty,
                            Url = new Uri("https://rainstormtech.com"),
                        },
                    });

                var filePath = Path.Combine(System.AppContext.BaseDirectory, "RainstormTech.API.xml");
                c.IncludeXmlComments(filePath);
            });

            // define SQL Server connection string
            services.AddDbContext<ApplicationContext>(options =>
                options
                    .UseSqlServer(Configuration.GetConnectionString("DefaultConnection"), 
                        o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery))
                    );

            // as of 3.1.1 the internal .net core JSON doens't handle referenceloophandling so we still need to use Newtonsoft
            services.AddControllers()
                .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);


            // add identity services
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationContext>()
                .AddDefaultTokenProviders();

            // enable CORS
            services.AddCors(options =>
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                })
            );

            // add appsettings availability
            services.AddSingleton(Configuration);

            // ability to grab httpcontext
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // automapper - tell it where to find the automapper profile
            // services.AddAutoMapper(typeof(Startup));
            services.AddAutoMapper(typeof(AutoMapperProfile));

            services.AddMvc();

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            //var aiKey = Configuration.GetValue<string>("APPINSIGHTS_INSTRUMENTATIONKEY");
            services.AddLogging(loggingBuilder =>
            {
                //  loggingBuilder.AddApplicationInsights(aiKey);
                loggingBuilder.AddConfiguration(Configuration.GetSection("Logging"));
                loggingBuilder.AddConsole();
                loggingBuilder.AddDebug();
                //  loggingBuilder.AddSerilog();
                //  loggingBuilder.AddFilter<ApplicationInsightsLoggerProvider>
                //             (typeof(Program).FullName, LogLevel.Trace);

            });

            // configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // get security key
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            // configure jwt authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                /*  // optionally can make sure the user still exists in the db on each call
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
                        var user = userService.GetById(context.Principal.Identity.Name);
                        if (user == null)
                        {
                            // return unauthorized if user no longer exists
                            context.Fail("Unauthorized");
                        }
                        return Task.CompletedTask;
                    }
                };
                */
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // ValidAudience = "http://dotnetdetail.net",
                    // ValidIssuer = "http://dotnetdetail.net",
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });

            // add authorization
            services.AddAuthorization(options => {});            

            // handle authorization policies dynamically
            services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
            services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();

            // configure DI for application services

            /* Authentication / users / roles */
            services.AddScoped<IAuthenticationService, AuthenticationService>();            
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseHttpsRedirection();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sweet System V1");
            });

            // handle DB seeding
            SeedDb.Initialize(app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope().ServiceProvider);

            // use the following if hosting files/images using StandardFileService 
            var cachePeriod = env.IsDevelopment() ? "600" : "604800";
            app.UseStaticFiles(new StaticFileOptions
            {
                /*FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "assets")),
                    RequestPath = "/assets", */

                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", $"public, max-age={cachePeriod}");
                }
            }); // cuz we're hosting some images

            app.UseRouting();

            app.UseCors(
               options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
            );

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
