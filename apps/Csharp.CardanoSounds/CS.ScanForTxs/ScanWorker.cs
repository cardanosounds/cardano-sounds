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
        private static string addr;
        private static string queueApiUrl;
        private static int count;
        private static int stuckCount = 0;
        private static int pageCount = 1;
        private static float buyPriceLovelace;
        private static IncommingTransaction lastTx;
        private readonly Transactions transactions;

        public ScanWorker(ILogger<ScanWorker> logger)
        {
            _logger = logger;

            //initialation
            LoadConfig();
            Authenticate();

            transactions = new Transactions(_logger);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // _logger.LogInformation(_mintService.CreateNFTPolicy(160337, "anarchyCNFTpolicy"));
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("ScanWorker running at: {time}", DateTimeOffset.Now);
                try 
                {
                    await Scan();
                }
                catch(Exception ex)
                {
                    _logger.LogError(ex.Message);
                }

                await Task.Delay(TimeSpan.FromSeconds(10));
            }
        }

        private async Task Scan(int pageC = 1)
        {

            // var totalTxCount = transactions.GetTxCount();
            pageCount = pageC;

            var txs = await GetFilteredUtxos();

            lastTx = transactions.GetLastTx();
       
            var i = 1;
            if (lastTx != null)
            {
                bool convertN = int.TryParse(lastTx.Id, out i);
                i += 1;
            }

            foreach (var tx in txs)
            {
                //get sender's address
                var sender = await GetSenderAddress(tx.Tx_Hash);

                tx.Id = $"{i}";

                tx.Amount = tx.Amount.Select(x => DecodeHexTokenNames(x)).ToList();

                tx.SenderAddress = sender;
                var created = false;
                var status = ValidateBuyingTx(tx);
                if (status == "confirmed")
                {
                    try 
                    {
                        var txresult = await ProcessTransaction(tx);
                        if (txresult.Contains("Error"))
                        {
                            status = "failed";
                        }
                    }
                    catch(Exception ex)
                    {
                        _logger.LogError(ex, ex.Message);
                        status = "failed";
                    }
                    
                }
                else if(status == "stuck")
                {
                    stuckCount ++;
                    if(stuckCount == 5 && txs.Last() == tx)
                    {
                        tx.Status = status;
                        _logger.LogInformation("created tx: " + tx.Tx_Hash);
                        _logger.LogInformation("status : " + tx.Status);
                        _logger.LogTrace((await transactions.Create(tx)).ToString());
                        created = true;
                        await Scan(pageCount + 1);
                    }
                }
                tx.Status = status;

                _logger.LogInformation("created tx: " + tx.Tx_Hash);
                _logger.LogInformation("status : " + tx.Status);
                if(!created)_logger.LogTrace((await transactions.Create(tx)).ToString());

                i++;
            }

          
            await Task.Delay(TimeSpan.FromSeconds(30));

            pageCount = 1;
        }

        private CS.Models.TokenValue DecodeHexTokenNames(CS.Models.TokenValue tokenVal)
        {
            if(tokenVal.Unit != "lovelace" && !tokenVal.Unit.Contains("."))
            {
                var policy = tokenVal.Unit.Substring(0, 56);
                _logger.LogInformation(policy);
                _logger.LogInformation("policy");
                
                var hexTokenName = tokenVal.Unit.Replace(policy,"");
                _logger.LogInformation(hexTokenName);
                _logger.LogInformation("hexTokenName");

                if(!string.IsNullOrEmpty(hexTokenName))
                {
                    byte[] data = FromHex(hexTokenName);
                    string tokenName = Encoding.ASCII.GetString(data);
                    _logger.LogInformation(tokenName);
                    _logger.LogInformation("tokenName");
                    tokenVal.Unit = $"{policy}.{tokenName}";
                }
            }

            return tokenVal;
        }
        public static byte[] FromHex(string hex)
        {
            hex = hex.Replace("-", "");
            byte[] raw = new byte[hex.Length / 2];
            for (int i = 0; i < raw.Length; i++)
            {
                raw[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            }
            return raw;
        }

        private async Task<string> ProcessTransaction(IncommingTransaction tx)
        {
            _logger.LogInformation("confirmed tx: " + tx.Tx_Hash);
            _logger.LogInformation("NOW");
            tx.Status = "generationstart";
            var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(tx), Encoding.UTF8, "application/json");

            //add tx queue for generating sounds & websites (metadata)

            var result = await queueClient.PostAsync(queueApiUrl + "/addtxtoqueue", content);
            if(result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var output = $"added tx {tx.Tx_Hash} to queue";
                _logger.LogInformation(output);
                _logger.LogInformation(content.ToString());
                return output;
            }
            else
            {
                var output = $"Error : failed submitting tx {tx.Tx_Hash} to queue";
                _logger.LogError(output);
                return output;
            }
        }

        private string ValidateBuyingTx(IncommingTransaction tx)
        {
            bool tryRefund = false;
            bool valid = true;
            var status = "stuck";
            if (tx.Amount.Count != 1)
            {
                var lovelaceVal = tx.Amount.FirstOrDefault(x => x.Unit == "lovelace");

                if(lovelaceVal != null && lovelaceVal.Quantity >= 2000000)
                {
                    tryRefund = true;
                }

                valid = false;
            }
            else 
            {
                var amount = tx.Amount.First();

                if (amount.Unit != "lovelace") 
                {
                    valid = false;
                }
                else if(amount.Quantity != buyPriceLovelace) 
                {
                    valid = false;
                    if(amount.Quantity > 1500000) tryRefund = true;
                }
                else 
                {
                    return "confirmed";
                }
            }

            if(tryRefund && !valid)
            {
                var cliResult = "";
                try
                {
                    return "invalid";
                }
                catch(Exception ex)
                {
                    _logger.LogError("failed submit with error:");
                    _logger.LogError(ex.ToString());
                    return "stuck";
                }
                finally 
                {
                    if(cliResult.ToLower().Contains("error"))
                    {
                        _logger.LogError("failed submit with error:");
                        _logger.LogError(cliResult);
                    }
                }
            }
            else if(!tryRefund && !valid)
            {
                return "stuck";
            }

            return status;
        }

        private async Task<List<IncommingTransaction>> GetTransactions()
        {
            var transactions = new List<IncommingTransaction>();

            //create request url and log
            var reqUrl = blockfrostApiUrl + "addresses/" + addr + "/utxos?" + "count=" + count + "&page=" + pageCount + "&order=asc";
            _logger.LogTrace("Sending request to:" + Environment.NewLine + reqUrl);

            try
            {
                var streamTask = blockfrostClient.GetStreamAsync(reqUrl);
                var txs = await streamTask;

                var transactionsArr = (JArray)DeserializeFromStream(txs);

                transactions = transactionsArr.ToObject<List<IncommingTransaction>>();

                transactions.ForEach(tx => 
                { 
                    if(tx.Amount?.Count == 1 && tx.Amount.First().Unit == "lovelace") 
                    { 
                        tx.NftCount = tx.Amount.First().Quantity / buyPriceLovelace; 
                    }
                    else tx.NftCount == 0;

                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return transactions;
        }
        private async Task<List<IncommingTransaction>> GetFilteredUtxos()
        {
            var txs = await GetTransactions();
            Console.WriteLine("Unfiltered");
            foreach(var txhash in txs.Select(x => x.Tx_Hash.ToString())) Console.WriteLine(txhash);
            Console.WriteLine("");
            Console.WriteLine("");
            txs = await FilterUtxo(txs);
            Console.WriteLine("FILTERED");
            foreach(var txhash in txs.Select(x => x.Tx_Hash.ToString())) Console.WriteLine(txhash);
            Console.WriteLine("");
            Console.WriteLine("");
            return txs;
        }
        private async Task<List<IncommingTransaction>> FilterUtxo(List<IncommingTransaction> txs)
        {
            IncommingTransaction[] txsCopy = new IncommingTransaction[txs.Count];
            txs.CopyTo(txsCopy);

            foreach(var txhash in txs.Select(x => x.Tx_Hash.ToString())) 
            {
                Console.WriteLine("txs#308");
                Console.WriteLine(txhash);
            }
            Console.WriteLine("FilterUtxo");
            Console.WriteLine("");
            Console.WriteLine("");
            Console.WriteLine("txs.Count");
            Console.WriteLine(txs.Count);
            var i = 0;

            foreach(var tx in txs)
            {
                i++;
                var txDbData = transactions.GetDbTransactionsDataForIncomming(tx);
                Console.WriteLine("i");
                Console.WriteLine("i");
                Console.WriteLine("i");
                Console.WriteLine(i);
                Console.WriteLine();
                Console.WriteLine();

                foreach(var txhash in txDbData.Select(x => x.Tx_Hash.ToString())) 
                {
                    Console.WriteLine("txhash#314+i="+i);
                    Console.WriteLine(txhash);
                }

                if (txDbData.Any())
                {
                    Console.WriteLine("db FOR TX:");
                    Console.WriteLine(tx.Tx_Hash);
                    var toUpdateTxJson =  Newtonsoft.Json.JsonConvert.SerializeObject(tx);
                    var toUpdateTx =  Newtonsoft.Json.JsonConvert.DeserializeObject<IncommingTransaction>(toUpdateTxJson);

                    //remove item
                    txsCopy = txsCopy.Where(y => y.Tx_Hash != tx.Tx_Hash || (y.Tx_Hash == tx.Tx_Hash && y.Output_Index != tx.Output_Index)).ToArray();

                    Console.WriteLine("1");
                    Console.WriteLine();
                    Console.WriteLine();
                    foreach (var txDb in txDbData)
                    {
                        Console.WriteLine("2");
                        Console.WriteLine();
                        Console.WriteLine();
                        var update = false;
                        if (toUpdateTx.Output_Index == txDb.Output_Index)
                        {
                            toUpdateTx.Id = txDb.Id;
                            switch (txDb.Status)
                            {
                                case "finished":
                                    if (txDb.Created.AddMinutes(30) < DateTime.Now)
                                    {
                                        toUpdateTx.Status = "generated";
                                        update = true;
                                    }
                                    break;
                                case "refunded":
                                    if (txDb.Created.AddMinutes(30) < DateTime.Now)
                                    {
                                        toUpdateTx.Status = "invalid";
                                        update = true;
                                    }
                                    break;
                                case "confirmed":
                                    break;
                                case "generated":
                                    break;
                                case "invalid":
                                    break;
                                case "failed":
                                    break;
                                case "failed mint":
                                        toUpdateTx.Status = "invalid";
                                        update = true;
                                    break;
                                default:
                                    break;
                            }
                        }
                        else
                        {
                            toUpdateTx.Status = "invalid";
                            update = true;
                        }
                        Console.WriteLine("3");
                        Console.WriteLine();
                        Console.WriteLine();

                        if (update) await transactions.Update(toUpdateTx);

                        Console.WriteLine("4");
                        Console.WriteLine();
                        Console.WriteLine();
                    }
                }
                else 
                {
                    Console.WriteLine("NO DB FOR TX:");
                    Console.WriteLine(tx.Tx_Hash);
                }
            }

            Console.WriteLine("5");
            Console.WriteLine();
            Console.WriteLine();
            if (txsCopy.Any() || txs.Count < 5)
            {
                Console.WriteLine(i);
                return txsCopy.ToList();

            }
            Console.WriteLine("6");
            Console.WriteLine();
            Console.WriteLine();
            
            pageCount++;

           return await GetFilteredUtxos();
        }

        private async Task<string> GetSenderAddress(string txhash)
        {
            //create request url and log
            var reqUrl = blockfrostApiUrl + "txs/" + txhash + "/utxos";
            _logger.LogTrace("Sending request to:" + Environment.NewLine + reqUrl);

            var stream = await blockfrostClient.GetStreamAsync(reqUrl);

            //get UtxOs for transaction
            var utxosArr = (JObject)DeserializeFromStream(stream);

            var utxos = utxosArr.ToObject<FullDataTx>();

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
            queueApiUrl = ConfigurationManager.AppSettings["QueueApiUrl"];
            

            float.TryParse(ConfigurationManager.AppSettings["LovelaceBuyPrice"], out buyPriceLovelace);

            //set how many tx you read at once
            count = 5;
            //int.TryParse(ConfigurationManager.AppSettings["ReadByCount"], out count);
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
