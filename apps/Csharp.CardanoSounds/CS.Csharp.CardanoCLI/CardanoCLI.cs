using System;
using System.Diagnostics;
using CS.Csharp.CardanoCLI.Models;

namespace CS.Csharp.CardanoCLI
{
    public class CardanoCLI
    {
        private static readonly string network = "--testnet-magic 1097911063"; //--mainnet
        private static readonly string cardano_cli_location = $"/home/azureuser/cardano-node-1.27.0/cardano-cli";
        static void Main(string[] args)
        {
            var cli = new CardanoCLI();
            cli.QueryTip();
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

        //public void SendTransaction(string txInHash, int txInId, Dictionary<string, string> )
    }
}
