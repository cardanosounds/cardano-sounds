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

            //TestTransaction();
            //TestCreatePolicy();
            var examples = new Examples(network, signing_key, working_directory);

            examples.TestMintTokens();

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
