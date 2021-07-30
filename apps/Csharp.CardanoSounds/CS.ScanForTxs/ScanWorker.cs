using CS.DB.Cosmos;
using CS.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CS.ScanForTxs
{
    public class ScanWorker : BackgroundService
    {
        private readonly ILogger<ScanWorker> _logger;
        private static readonly HttpClient blockfrostClient = new HttpClient();
        private static readonly HttpClient queueClient = new HttpClient();
        private static string projectId;
        private static string blockfrostApiUrl;
        private static string queueApiUrl;
        private static string addr;
        private static int count;
        private static int pageCount = 1;
        private static readonly float buyPriceLovelace = 5000000;
        private static IncommingTransaction lastTx;
        private readonly Transactions transactions;

        public ScanWorker(ILogger<ScanWorker> logger)
        {
            _logger = logger;
            LoadConfig();
            Authenticate();
            transactions = new Transactions(_logger);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("ScanWorker running at: {time}", DateTimeOffset.Now);
                await Scan();
            }
        }

        private async Task Scan()
        {
            
            var totalTxCount = transactions.GetTxCount();
            pageCount = ( totalTxCount / 10) + 1;

            var txs = await GetTransactions();
            
            lastTx = transactions.GetLastTx();            
            var lastTxHash = lastTx?.Tx_Hash;

            //NFT index
            var i = 1;
            if(lastTx != null)
            {
                bool convertN = int.TryParse(lastTx.Id.Replace("CSNFT", ""), out i);
                if(!convertN)
                {
                    _logger.LogWarning("Couldn't parse id from DB, id: " + lastTx.Id);
                }
                i += 1;
            }

            if (lastTx != null && txs.Select(t => t.Tx_Hash).Contains(lastTxHash))
            {
                var index = txs.Select(t => t.Tx_Hash).ToList().IndexOf(lastTxHash);
                if (index + 1 == count)
                {
                    pageCount++;
                    txs = await GetTransactions();
                }
                else
                {
                    txs.RemoveRange(0, index + 1);
                }
            }
            foreach (var tx in txs)
            {
                //get sender's address
                var sender = await GetSenderAddress(tx.Tx_Hash);

                tx.Id = $"CSNFT{i}";

                tx.SenderAddress = sender;

                await ProcessTransaction(tx);

                i++;
            }

            if (txs == null || txs.Count < 1) 
            {
                await Task.Delay(TimeSpan.FromSeconds(10));
            }
            pageCount = 1;
        }

        private async Task ProcessTransaction(IncommingTransaction tx)
        {
            var transactions = new Transactions(_logger);
            if (ValidateBuyingTx(tx))
            {
                tx.Status = "confirmed";
                _logger.LogInformation("confirmed tx: " + tx.Tx_Hash);
                _logger.LogTrace((await transactions.Create(tx)).ToString());

                var content = new StringContent(tx.ToString(), Encoding.UTF8, "application/json");

                //add tx queue for generating sounds & websites (metadata)
                //var result = await queueClient.PostAsync(queueApiUrl + "/addtxtoqueue", content);
                ////if(result.StatusCode == System.Net.HttpStatusCode.OK)
                //{
                //    _logger.LogInformation($"added tx {tx.Tx_Hash} to queue");
                //}
                //else
                //{
                //    _logger.LogError($"failed submitting tx {tx.Tx_Hash} to queue");
                //}
            }
            else
            {
                tx.Status = "invalid";

                _logger.LogInformation("invalid tx: " + tx.Tx_Hash);
                _logger.LogTrace((await transactions.Create(tx)).ToString());
            }
        }

        private static bool ValidateBuyingTx(IncommingTransaction tx)
        {
            if(tx.Amount.Count != 1)
            {
                return false;
            }
            var amount = tx.Amount.First();

            if (amount.Unit != "lovelace" || amount.Quantity != buyPriceLovelace) return false;

            return true;
        }

        private async Task<List<IncommingTransaction>> GetTransactions()
        {
            var transactions = new List<IncommingTransaction>();

            //create request url and log
            var reqUrl = blockfrostApiUrl + "addresses/" + addr + "/utxos?" + "count=" + count + "&page=" + pageCount + "&order=asc";
            _logger.LogInformation("Sending request to:" + Environment.NewLine + reqUrl);

            try
            {
                var streamTask = blockfrostClient.GetStreamAsync(reqUrl);
                var txs = await streamTask;

                var transactionsArr = (JArray)DeserializeFromStream(txs);

                transactions = transactionsArr.ToObject<List<IncommingTransaction>>();
            }
            catch (Exception ex)
            {

                _logger.LogError(ex.Message);
            }

            return transactions;
        }

        private async Task<string> GetSenderAddress(string txhash)
        {
            //create request url and log
            var reqUrl = blockfrostApiUrl + "txs/" + txhash + "/utxos"; 
            _logger.LogTrace("Sending request to:" + Environment.NewLine + reqUrl);

            var stream = await blockfrostClient.GetStreamAsync(reqUrl);

            //get UtxOs for transaction
            var utxosArr = (JObject)DeserializeFromStream(stream);

            var utxos = utxosArr.ToObject<UtxOs>();

            //use first input if there is more of them
            var frstInput = utxos.Inputs[0];

            return frstInput.Address;
        }

        private static void LoadConfig()
        {
            //blockfrost project id
            projectId = ConfigurationManager.AppSettings["ProjectId"];

            //address to scan
            addr = ConfigurationManager.AppSettings["Address"];

            //blockfrost api url - mainnet/testnet
            blockfrostApiUrl = ConfigurationManager.AppSettings["BlockfrostApiUrl"];

            //custom api url - queue for generating sounds & websites (metadata)
            queueApiUrl = ConfigurationManager.AppSettings["QueueApiUrl"];

            //set how many tx you read at once
            int.TryParse(ConfigurationManager.AppSettings["ReadByCount"], out count);
        }

        private static void Authenticate()
        {
            blockfrostClient.DefaultRequestHeaders.Accept.Clear();

            //authentication header
            blockfrostClient.DefaultRequestHeaders.Add("project_id", projectId);
        }

        private static object DeserializeFromStream(Stream stream)
        {
            using (var reader = new StreamReader(stream))
            {
                string value = reader.ReadToEnd();
                var txs = JsonConvert.DeserializeObject(value);
                return txs;
            }

        }
    }
}
