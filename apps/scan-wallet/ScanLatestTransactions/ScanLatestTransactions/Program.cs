using ScanLatestTransactions.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using System.Configuration;

namespace ScanLatestTransactions
{
    class Program
    {
        private static readonly HttpClient client = new HttpClient();
        private static readonly string order = "asc";
        private static string projectId;
        private static string apiUrl;
        private static string addr;
        private static int count;
        private static int pageCount = 1;

        static async Task Main(string[] args)
        {
            //load configuration from App.config
            LoadConfig();

            //get transactions
            var txs = await GetTransactions();

            foreach (var tx in txs)
            {
                //get sender's address
                var sender = await GetSenderAddress(tx.TxHash);

                tx.SenderAddress = sender;
            }

            Console.ReadLine();
        }

        private static async Task<List<Transaction>> GetTransactions()
        {
            ReAuthenticate();

            //create request url and log
            var reqUrl = apiUrl + "addresses/" + addr + "/utxos?" + "count=" + count + "&page=" + pageCount + "&order=" + order;
            Logging.Log("Sending request to:" + Environment.NewLine + reqUrl);

            var streamTask = client.GetStreamAsync(reqUrl);
            var transactions = await JsonSerializer.DeserializeAsync<List<Transaction>>(await streamTask);
            return transactions;
        }

        private static async Task<string> GetSenderAddress(string tx)
        {
            ReAuthenticate();

            //create request url and log
            var reqUrl = apiUrl + "addresses/" + addr + "/utxos?" + "count=" + count + "&page=" + pageCount + "&order=" + order;
            Logging.Log("Sending request to:" + Environment.NewLine + reqUrl);

            var streamTask = client.GetStreamAsync(reqUrl);

            //get UtxOs for transaction
            var utxos = await JsonSerializer.DeserializeAsync<UtxOs>(await streamTask);

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
            apiUrl = ConfigurationManager.AppSettings["ApiUrl"];

            //set how many tx you read at once
            Int32.TryParse(ConfigurationManager.AppSettings["ReadByCount"], out count);

        }

        private static void ReAuthenticate()
        {
            client.DefaultRequestHeaders.Accept.Clear();

            //authentication header
            client.DefaultRequestHeaders.Add("project_id", projectId);
        }
    }
}
