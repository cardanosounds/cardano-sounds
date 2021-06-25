using System;
using System.Diagnostics;
using CS.Csharp.CardanoCLI.Models;

namespace CS.Csharp.CardanoCLI
{
    public class CardanoCLI
    {
        private static readonly string network = "--testnet-magic 1097911063"; //--mainnet
        private static readonly string cardano_cli_location = $"/home/azureuser/cardano-node-1.27.0/cardano-cli"; //.exe for windows
        private static readonly string working_directory = "/home/azureuser/cardano-node-1.27.0";

        private static readonly string signing_key = @"signing-key";

        private static readonly string incmd_newline = @" ";

        static void Main(string[] args)
        {
            //var cli = new CardanoCLI();
            //cli.QueryTip();

            var initialAda = 994825039;


            var txParams = new TransactionParams()
            {
                TxFileName = $"tx2",
                LovelaceValue = 5000000,
                SendAllTxInAda = false,
                SenderAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
                SendToAddress = "addr_test1vpl22c6vml7p7n5vv4n2mjf6sfw9kcse5c7jjk3uxc9dllcvvvj8q",
                TxInLovelaceValue = initialAda,
                TxInHash = "7b8b5e3141b1239bf69e7513e599babc02a204602952abcac2fea226563712ab",
                TxInIx = 1
            };

            var ttl = QueryTip().Slot + 100;

            var transactions = new Transactions(incmd_newline, network, signing_key);
            
            var f = transactions.PrepareTransaction(txParams, ttl);
            Console.WriteLine(f);
            if (!f.StartsWith("CS.Error"))
            {
                var protocolParams = SetProtocolParamaters();
                if (!HasError(protocolParams))
                {
                    var minFee = transactions.CalculateMinFee(txParams, ttl);
                    if (!HasError(minFee))
                    {
                        Console.WriteLine(minFee);
                        var buildTx = transactions.BuildTransaction(txParams, (long)Convert.ToInt64(minFee.Replace(" Lovelace", "")), ttl);
                        if (!HasError(buildTx))
                        {
                            var signTx = transactions.SignTransaction(txParams);
                            if (!HasError(signTx))
                            {
                                var submit = transactions.SubmitTransaction(txParams);
                                Console.WriteLine(submit);
                                if (!HasError(submit))
                                {
                                    Console.WriteLine("Success!");
                                }
                            }
                            else
                            {
                                Console.WriteLine("SIGN ERROR: " + signTx);
                            }
                        }
                        else
                        {
                            Console.WriteLine("BUILD ERROR: " + buildTx);
                        }
                    }
                    else
                    {
                        Console.WriteLine("FEE CALC ERROR: " + minFee);
                    }
                }
                else
                {
                    Console.WriteLine("PROTOCOL PARAMS ERROR: " + protocolParams);
                }
            }
            else 
            {
                Console.WriteLine("PREPARE ERROR: " + f);
            }
        }
        

        public static bool HasError(string output)
        {
            return output.StartsWith("CS.Error");
        }

        public static string RunCLICommand(string cmd)
        {
            try
            {
                var process = new Process();
                var processStartInfo = new ProcessStartInfo()
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    FileName = cardano_cli_location,
                    WorkingDirectory = working_directory,
                    Arguments = cmd,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                };
                process.StartInfo = processStartInfo;
                process.Start();

                String error = process.StandardError.ReadToEnd();
                String output = process.StandardOutput.ReadToEnd();

                return string.IsNullOrEmpty(error) ? output : $"CS.Error: {error}";
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex.Message, ex);
                throw;
            }
        }

        public static Tip QueryTip()
        {
            string cmd = $"query tip {network}";
            var output = RunCLICommand(cmd);

            if (output.StartsWith("CS.Error")) return new Tip();

            return Tip.FromJson(output);
        }

        public static string SetProtocolParamaters()
        {
            var cmd = @"query protocol-parameters";
            cmd += incmd_newline;

            cmd += network;
            cmd += incmd_newline;

            cmd += "--out-file protocol.json";

            return RunCLICommand(cmd);
        }

    }
}
