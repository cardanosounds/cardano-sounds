using System;
using System.Diagnostics;
using CS.Csharp.CardanoCLI.Models;

namespace CS.Csharp.CardanoCLI
{
    public class CLI
    {
        public readonly string _network; //= "--testnet-magic 1097911063"; //--mainnet
        public readonly string _cardano_cli_location; //= $"/home/azureuser/cardano-node-1.27.0/cardano-cli"; //.exe for windows
        public readonly string _working_directory; //= "/home/azureuser/cardano-node-1.27.0";
        public ILogger _logger;

        private static readonly string incmd_newline = @" ";

        public CLI(string network, string cardano_cli_path, string working_directory, ILogger logger)
        {
            _network = network;
            _cardano_cli_location = cardano_cli_path;
            _working_directory = working_directory;
            _logger = logger;
        }

        public bool HasError(string output)
        {
            return output.StartsWith("CS.Error");
        }

        public string RunCLICommand(string cmd)
        {
            try
            {
                var process = new Process();
                var processStartInfo = new ProcessStartInfo()
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    FileName = _cardano_cli_location,
                    WorkingDirectory = _working_directory,
                    Arguments = cmd,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                };
                Console.WriteLine(processStartInfo.WorkingDirectory);
                Console.WriteLine(processStartInfo.FileName);
                process.StartInfo = processStartInfo;
                process.Start();

                String error = process.StandardError.ReadToEnd();
                String output = process.StandardOutput.ReadToEnd();

                return string.IsNullOrEmpty(error) ? output : $"CS.Error: {error}";
            }
            catch (Exception ex)
            {
                _logger.Err(ex.Message, ex);
                return $"CS.Error: {ex.Message}";
            }
        }

        public Tip QueryTip()
        {
            string cmd = $"query tip {_network}";
            var output = RunCLICommand(cmd);

            if (output.StartsWith("CS.Error"))
            {
                return new Tip();
            }

            return Tip.FromJson(output);
        }

        public string SetProtocolParamaters()
        {
            var cmd = @"query protocol-parameters";
            cmd += incmd_newline;

            cmd += _network;
            cmd += incmd_newline;

            cmd += "--out-file protocol.json";

            return RunCLICommand(cmd);
        }

    }
}
