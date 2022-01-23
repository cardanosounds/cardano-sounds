using CS.Csharp.CardanoCLI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Csharp.CardanoCLI
{
    public class Addresses
    {
        private readonly string _incmd_newline = " ";
        private readonly CLI _cli;

        public Addresses(CLI cli)
        {
            _cli = cli;
        }

        public void GeneratePaymentKeys(string signingKeyPath, string verificationKeyPath)
        {
            var cmd = @"address key-gen";
            cmd += _incmd_newline;
            cmd += $"--verification-key-file {verificationKeyPath}";
            cmd += _incmd_newline;
            cmd += $"--signing-key-file {signingKeyPath}";
            _cli._logger.Log(_cli.RunCLICommand(cmd));
        }

        public string CreateNewAddress(string signingKeyPath, string verificationKeyPath)
        {
            Console.WriteLine("GeneratePaymentKeys");
            //GeneratePaymentKeys(signingKeyPath, verificationKeyPath);
            Console.WriteLine("Generated PaymentKeys");

            var cmd = @"address build";
            cmd += _incmd_newline;
            cmd += $"--payment-verification-key-file {verificationKeyPath}";
            cmd += _incmd_newline;
            cmd += _cli._network;

            return _cli.RunCLICommand(cmd);
        }
    }
}
