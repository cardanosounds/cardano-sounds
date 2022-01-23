using CS.Csharp.CardanoCLI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CS.Csharp.CardanoCLI
{
    public class Policies
    {
        private readonly string _incmd_newline = " ";
        private readonly CLI _cli;

        public Policies(CLI cli)
        {
            _cli = cli;
        }

        public Policy Create(PolicyParams pParams)
        {
            Policy policy = new Policy();
            var policyKeyHash = GeneratePolicyKeyHash(pParams);

            string error;
            if (_cli.HasError(policyKeyHash))
            {
                error = policyKeyHash;
                Console.WriteLine(error);
                return policy;
            }

            var policyScriptFile = CreatePolicyScriptFile(pParams, policyKeyHash);

            if (_cli.HasError(policyScriptFile))
            {
                error = policyScriptFile;
                Console.WriteLine(error);
                return policy;
            }

            policy.PolicyKeyHash = policyKeyHash;
            policy.PolicyScriptFile = $"{pParams.PolicyName}.script";
            policy.SigningKeyFile = pParams.SigningKeyFile;
            policy.VerificationKeyFile = pParams.VerificationKeyFile;

            return policy;
        }

        public string GeneratePolicySigningKeys(PolicyParams pParams)
        {
            var cmd = $"address key-gen";
            cmd += _incmd_newline;

            cmd += $"--verification-key-file {pParams.PolicyName}.vkey";
            cmd += _incmd_newline;

            cmd += $"--signing-key-file {pParams.PolicyName}.skey";

            return _cli.RunCLICommand(cmd);
        }

        public string GeneratePolicyKeyHash(PolicyParams pParams)
        {
            var cmd = $"address key-hash --payment-verification-key-file {pParams.VerificationKeyFile}";
            var output = _cli.RunCLICommand(cmd);
            
            return Regex.Replace(output, @"\s", "");
        }

        public string CreatePolicyScriptFile(PolicyParams pParams, string policyKeyHash)
        {

            var script = @"{
    ""type"": ""all"",
    ""scripts"": [
        {
        ""keyHash"": ""POLICY_KEY_HASH"",
        ""type"": ""sig""
        }";
    if (pParams.TimeLimited) script += @",
        {
        ""type"": ""before"",
        ""slot"": SLOT
        }";
    script += @"
    ]
}";

            script = script.Replace("POLICY_KEY_HASH", policyKeyHash);

            var currentSlot = _cli.QueryTip().Slot;

            if (pParams.TimeLimited) 
            {
                script = script.Replace("SLOT", (currentSlot + (pParams.ValidForMinutes * 60)).ToString());
            }
            try
            {   
                System.IO.File.WriteAllText($"{_cli._working_directory}/{pParams.PolicyName}.script", script);
            }
            catch(Exception ex)
            {
                return $"CS.Error: {ex.Message}";
            }

            return $"{pParams.PolicyName}.script";
        }

        public string GeneratePolicyId(string policyName)
        {
            var cmd = $"transaction policyid";
            cmd += " ";

            cmd += $"--script-file {policyName}.script";

            var output = _cli.RunCLICommand(cmd);

            return Regex.Replace(output, @"\s", "");
        }
    }
}
