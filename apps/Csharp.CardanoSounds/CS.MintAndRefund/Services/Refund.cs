using CS.Csharp.CardanoCLI;
using CS.Csharp.CardanoCLI.Models;
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
        public readonly string _signing_key = ConfigurationManager.AppSettings["CLI_SIGNING_KEY"];
        private readonly CLI _cli;
        private readonly ILogger<Refund> _logger;

        public Refund(ILogger<Refund> logger)
        {
            _cli = new CLI(_network, _cardano_cli_location, _working_directory, new CliLogger(logger));
            _logger = logger;
        }

        public async Task RefundFromInvalidDBTransaction()
        {
            var tx = DB.Cosmos.Transactions.GetInvalidTransaction();

            if (tx == null)
            {
                _logger.LogTrace("No records to refund, waiting 5 sec");
                await Task.Delay(TimeSpan.FromSeconds(5));
                return;
            }

            var txParams = CreateTransactionParameters(tx);
            var response = CreateTx(txParams);

            if (response.StartsWith("Error"))
            {
                _logger.LogError(response);
            }
            else
            {
                _logger.LogInformation("Refund: " + response);
            }
        }

        private TransactionParams CreateTransactionParameters(Models.FullTransaction tx) => new TransactionParams()
        {
            TxFileName = $"{tx.Tx_Hash}.refund",
            TransactionInputs = new List<TxIn>
            {
                new TxIn
                {
                    TxHash = tx.Tx_Hash,
                    TxIx = tx.Output_Index,
                    Amount = tx.Amount.Select(x => new TokenValue(x.Quantity, x.Unit)).ToList()
                }
            },
            TransactionOutputs = new List<TxOut>
            {
                new TxOut
                {
                    RecipientAddress = tx.SenderAddress,
                    PaysFee = true,
                    Amount = tx.Amount.Select(x => new TokenValue(x.Quantity, x.Unit)).ToList()
                }
            },
            SendAllTxsUnspentOutput = true,
            SigningKeyFile = _signing_key
        };

        private string CreateTx(TransactionParams txParams)
        {
            Transactions transactions = new Transactions(_cli);

            var ttl = _cli.QueryTip().Slot + 120;

            var prepare = transactions.PrepareTransaction(txParams, ttl);
            if (_cli.HasError(prepare)) { return "Error prepare: " + prepare; }

            var minFee = transactions.CalculateMinFee(txParams);
            if (_cli.HasError(minFee)) { return "Error minFee: " + minFee; }

            var build = transactions.BuildTransaction(txParams, Int64.Parse(minFee), ttl);
            if (_cli.HasError(build)) { return "Error build: " + build; }

            var sign = transactions.SignTransaction(txParams);
            if (_cli.HasError(sign)) { return "Error sign: " + sign; }

            var submit = transactions.SubmitTransaction(txParams);
            if (_cli.HasError(submit)) { return "Error submit: " + submit; }

            return submit;
        }
    }
}
