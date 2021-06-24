using System;
using System.Diagnostics;

namespace CS.Csharp.CardanoCLI
{
    public class CardanoCLI
    {
        public void QueryTip()
        {
            try
            {
                var process = new Process();
                var processStartInfo = new ProcessStartInfo()
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    FileName = $"/home/azureuser/cardano-node-1.27.0/cardano-cli",
                    //WorkingDirectory = "/home/azureuser",
                    Arguments = "query tip --testnet-magic 1097911063",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false
                };
                process.StartInfo = processStartInfo;
                process.Start();

                String error = process.StandardError.ReadToEnd();
                String output = process.StandardOutput.ReadToEnd();
                Console.WriteLine(string.IsNullOrEmpty(error) ? output : error);
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex.Message, ex);
                throw;
            }
        }
    }
}
