using CS.MintAndRefund.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CS.MintAndRefund
{
    public class MintAndRefundWorker : BackgroundService
    {
        private readonly ILogger<MintAndRefundWorker> _logger;
        private readonly IMint _mintService;
        private readonly IRefund _refundService;

        public MintAndRefundWorker(ILogger<MintAndRefundWorker> logger, IMint mintService, IRefund refundService)
        {
            _logger = logger;
            _mintService = mintService;
            _refundService = refundService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Run(_mintService.MintFromDbTransaction, CancellationToken.None);
                _logger.LogTrace("Finished mint");

                await Task.Run(_refundService.RefundFromInvalidDBTransaction, CancellationToken.None);
                _logger.LogTrace("Finished refund");
            }
        }
    }
}
