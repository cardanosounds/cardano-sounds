using System;
using System.Diagnostics;
using CS.Csharp.CardanoCLI.Models;

namespace CS.Csharp.CardanoCLI
{
    public class CardanoCLI
    {
        private static readonly string network = "--testnet-magic 1097911063"; //--mainnet
        private static readonly string cardano_cli_location = $"/home/azureuser/cardano-node-1.27.0/cardano-cli";
        private static readonly string working_directory = "/home/azureuser/cardano-node-1.27.0";

        private static readonly string incmd_newline = @" \";

        static void Main(string[] args)
        {
            var cli = new CardanoCLI();
            cli.QueryTip();

            var initialAda = 1000;
            //for(var i = 1; i <= 20; i++)
            //{
            //    var txParams = new TransactionParams()
            //    {
            //        TxFileName = $"tx{i}.raw",
            //        AdaValue = 5,
            //        SendAllTxInAda = false,
            //        SenderAddress = "",
            //        SendToAddress = "",
            //        TxInAdaValue = initialAda,
            //        TxInHash = "",
            //        TxInIx = 0
            //    };
            //}
            var txParams = new TransactionParams()
            {
                TxFileName = $"tx0.raw",
                AdaValue = 5,
                SendAllTxInAda = false,
                SenderAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
                SendToAddress = "addr_test1vpl22c6vml7p7n5vv4n2mjf6sfw9kcse5c7jjk3uxc9dllcvvvj8q",
                TxInAdaValue = initialAda,
                TxInHash = "b626268819bde1f2b0d659463cd245831ae4dfab8a05ff66d7e10a73bb3b38de",
                TxInIx = 0
            };

            var ttl = cli.QueryTip().Slot + 100;
            var f = cli.PrepareTransaction(txParams, ttl);
            Console.WriteLine(f);
        }

        public string RunCLICommand(string command)
        {
            try
            {
                var process = new Process();
                var processStartInfo = new ProcessStartInfo()
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    FileName = cardano_cli_location,
                    WorkingDirectory = working_directory, 
                    Arguments = command,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false
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

        public Tip QueryTip()
        {
            string command = $"query tip {network}";
            var output = RunCLICommand(command);
            
            if(output.StartsWith("CS.Error")) return new Tip();

            return Tip.FromJson(output); 
        }


        public void SendADA(TransactionParams txParams)
        {
            var ttl = QueryTip().Slot + 100;
            string txFile = PrepareTransaction(txParams, ttl);
        }

        private string PrepareTransaction(TransactionParams txParams, long ttl)
        {
            var command = @"transaction build-raw";
            command += incmd_newline;

            //tx in
            command += $"--tx-in {txParams.TxInHash}#{txParams.TxInIx}";
            command += incmd_newline;

            //1ADA = 1 000 000
            var lovelaceValue = txParams.AdaValue * 1000000;

            //send to - tx out
            command += $"--tx-out {txParams.SendToAddress}+{lovelaceValue}";
            command += incmd_newline;

            //return change
            if (!txParams.SendAllTxInAda)
            {
                command += $"--tx-out {txParams.SenderAddress}+{lovelaceValue}";
                command += incmd_newline;
            }


            command += $"--ttl {ttl}";
            command += incmd_newline;

            command += "--fee 170000";
            command += incmd_newline;

            command += $"--out-file {txParams.TxFileName}";

            RunCLICommand(command);

            return txParams.TxFileName;
        }
    }
}
