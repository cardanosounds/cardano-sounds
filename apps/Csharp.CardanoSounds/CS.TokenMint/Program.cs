using System;
using System.IO;
using CS.Csharp.CardanoCLI;
using CS.Csharp.CardanoCLI.Models;
using CS.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Serilog;
//using Csharp.CardanoCLI;

namespace CS.TokenMint
{
    class Program
    {
        private readonly string nftPolicyName = "";
        private readonly string nftName = "";

        private readonly string tokenPolicyName = "";
        private readonly string tokenName = "";

        static void Main(string[] args)
        {
            //CLI cli = new CLI 

            var host = AppStartup();

            var exampleService = ActivatorUtilities.CreateInstance<Examples>(host.Services);

            exampleService.TestMintTokens();
        }

        static void BuildConfig(IConfigurationBuilder builder)
        {
            // Check the current directory that the application is running on 
            // Then once the file 'appsetting.json' is found, we are adding it.
            // We add env variables, which can override the configs in appsettings.json
            builder.SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();
        }

        static IHost AppStartup()
        {
            var builder = new ConfigurationBuilder();
            BuildConfig(builder);

            // Specifying the configuration for serilog
            Log.Logger = new LoggerConfiguration() // initiate the logger configuration
                            .ReadFrom.Configuration(builder.Build()) // connect serilog to our configuration folder
                            .Enrich.FromLogContext() //Adds more information to our logs from built in Serilog 
                            .WriteTo.Console() // decide where the logs are going to be shown
                            .CreateLogger(); //initialise the logger

            Log.Logger.Information("Application Starting");
            var host = Host.CreateDefaultBuilder() // Initialising the Host 
                .ConfigureServices((context, services) => { // Adding the DI container for configuration
                    services.AddSingleton<IExamples, Examples>(); 
                })
                .UseSerilog() // Add Serilog
                .Build(); // Build the Host

            return host;
        }
    }
}
