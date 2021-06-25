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
            var cli = new CardanoCLI();
            cli.QueryTip();

            var initialAda = 1000;
            //for(var i = 1; i <= 20; i++)
            //{
            //}
            var txParams = new TransactionParams()
            {
                TxFileName = "tx0",
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

        public string RunCLICommand(string cmd)
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
            string cmd = $"query tip {network}";
            var output = RunCLICommand(cmd);

            if (output.StartsWith("CS.Error")) return new Tip();

            return Tip.FromJson(output);
        }

        public void SendADA(TransactionParams txParams)
        {
            var ttl = QueryTip().Slot + 100;
            string txFile = PrepareTransaction(txParams, ttl);
        }

        public string PrepareTransaction(TransactionParams txParams, long ttl)
        {
            var cmd = @"transaction build-raw";
            cmd += incmd_newline;

            //tx in
            cmd += $"--tx-in {txParams.TxInHash}#{txParams.TxInIx}";
            cmd += incmd_newline;

            //1ADA = 1 000 000
            var lovelaceValue = txParams.AdaValue * 1000000;

            //send to - tx out
            cmd += $"--tx-out {txParams.SendToAddress}+{lovelaceValue}";
            cmd += incmd_newline;

            //return change
            if (!txParams.SendAllTxInAda)
            {
                cmd += $"--tx-out {txParams.SenderAddress}+{lovelaceValue}";
                cmd += incmd_newline;
            }

            cmd += $"--ttl {ttl}";
            cmd += incmd_newline;

            cmd += "--fee 170000";
            cmd += incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.raw";

            return RunCLICommand(cmd);
        }

        public string SetProtocolParamaters()
        {
            var cmd = @"query protocol-paramaters";
            cmd += incmd_newline;

            cmd += network;
            cmd += incmd_newline;

            cmd += "--out-file protocol.json";

            return RunCLICommand(cmd);
        }

        public string CalculateMinFee(TransactionParams txParams, long ttl)
        {
            var cmd = @"transaction calculate-min-fee";
            cmd += incmd_newline;

            cmd += "--tx-in-count 1";
            cmd += incmd_newline;

            var outCount = txParams.SendAllTxInAda ? 1 : 2;
            cmd += $"--tx-out-count {outCount}";
            cmd += incmd_newline;

            cmd += $"--ttl {ttl}";

            cmd += network;
            cmd += incmd_newline;

            cmd += $"--signing-key-file {signing_key}";
            cmd += incmd_newline;

            cmd += "--protocol-params-file protocol.json";

            return RunCLICommand(cmd);
        }

        public string BuildTransaction(TransactionParams txParams, long minFee, long ttl)
        {
            var cmd = @"transaction build-raw";
            cmd += incmd_newline;

            cmd = $"--tx-in {txParams.TxInHash}#{txParams.TxInIx}";
            cmd += incmd_newline;

            //1ADA = 1 000 000
            long lovelaceValue = txParams.AdaValue * 1000000;
            lovelaceValue = txParams.SendAllTxInAda ? lovelaceValue - minFee : lovelaceValue;

            //send to - tx out - fee is subtracted from all value
            cmd += $"--tx-out {txParams.SendToAddress}+{lovelaceValue}";
            cmd += incmd_newline;

            //return change - fee pays sender
            if (!txParams.SendAllTxInAda)
            {
                var txInputLovelace = txParams.TxInAdaValue * 1000000;
                cmd += $"--tx-out {txParams.SenderAddress}+{txInputLovelace - lovelaceValue - minFee}";
                cmd += incmd_newline;
            }

            cmd += $"--ttl {ttl}";
            cmd += incmd_newline;

            cmd += $"--fee {minFee}";
            cmd += incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.raw";

            return RunCLICommand(cmd);
        }

        public string SignTransaction(TransactionParams txParams)
        {
            var cmd = @"transaction sign";
            cmd += incmd_newline;

            cmd += $"--tx-body-file {txParams.TxFileName}.raw";
            cmd += incmd_newline;

            cmd += $"--signing-key-file {signing_key}";
            cmd += incmd_newline;

            cmd += network;
            cmd += incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.signed";

            return RunCLICommand(cmd);
        }

        public string SubmitTransaction(TransactionParams txParams)
        {
            var cmd = @"transaction submit";
            cmd += incmd_newline;

            cmd += $"--tx-file {txParams.TxFileName}.signed";
            cmd += incmd_newline;

            cmd += network;

            return RunCLICommand(cmd);

        }
    }
}
