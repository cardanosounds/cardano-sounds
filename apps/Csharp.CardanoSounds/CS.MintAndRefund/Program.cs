using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CS.MintAndRefund.Interfaces;
using CS.MintAndRefund.Services;

namespace CS.MintAndRefund
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSystemd()
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddSingleton<IMint, Mint>(); 
                    services.AddSingleton<IRefund, Refund>(); 
                    services.AddHostedService<MintAndRefundWorker>();
                });
    }
}
