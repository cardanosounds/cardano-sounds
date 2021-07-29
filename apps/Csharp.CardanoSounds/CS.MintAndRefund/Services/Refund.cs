using CS.Csharp.CardanoCLI;
using CS.MintAndRefund.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.MintAndRefund.Services
{
    public class Refund : IRefund
    {
        public readonly string _network = ConfigurationManager.AppSettings["CLI_NETWORK"];
        public readonly string _cardano_cli_location = ConfigurationManager.AppSettings["CLI_PATH"];
        public readonly string _working_directory = ConfigurationManager.AppSettings["CLI_WORKING_DIR"];
        private readonly CLI cli;
        public Refund(ILogger<Refund> logger)
        {
            cli = new CLI(_network, _cardano_cli_location, _working_directory, new CliLogger(logger));
        }
        public void RefundFromInvalidDBTransaction()
        {
            throw new NotImplementedException();
        }
    }
}
