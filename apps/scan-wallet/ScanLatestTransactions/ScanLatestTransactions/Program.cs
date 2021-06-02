﻿using ScanLatestTransactions.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Configuration;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
                var sender = await GetSenderAddress(tx.Tx_Hash);

                tx.SenderAddress = sender;
            }

            Console.ReadLine();
        }

        private static async Task<List<Transaction>> GetTransactions()
        {
            Authenticate();

            var transactions = new List<Transaction>();

            //create request url and log
            var reqUrl = apiUrl + "addresses/" + addr + "/utxos?" + "count=" + count + "&page=" + pageCount + "&order=" + order;
            Logging.Log("Sending request to:" + Environment.NewLine + reqUrl);

            try
            {
                var streamTask = client.GetStreamAsync(reqUrl);
                var txs = await streamTask;

                //var reader = new StreamReader(txs);
                var transactionsArr = (JArray)DeserializeFromStream(txs);

                transactions = transactionsArr.ToObject<List<Transaction>>();
            }
            catch (Exception ex)
            {

                Logging.Error(ex.Message);
            }

            return transactions;
        }

        private static async Task<string> GetSenderAddress(string txhash)
        {
            //create request url and log
            var reqUrl = apiUrl + "txs/" + txhash + "/utxos"; //? + "count=" + count + "&page=" + pageCount + "&order=" + order;
            Logging.Log("Sending request to:" + Environment.NewLine + reqUrl);

            var stream = await client.GetStreamAsync(reqUrl);

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
            apiUrl = ConfigurationManager.AppSettings["ApiUrl"];

            //set how many tx you read at once
            Int32.TryParse(ConfigurationManager.AppSettings["ReadByCount"], out count);

        }

        private static void Authenticate()
        {
            client.DefaultRequestHeaders.Accept.Clear();

            //authentication header
            client.DefaultRequestHeaders.Add("project_id", projectId);
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
