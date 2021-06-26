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
        private string _network;
        private string _incmd_newline;
        private string _working_dir;

        public Policies(string network, string working_dir, string incmd_newline = " ")
        {
            _network = network;
            _incmd_newline = incmd_newline;
            _working_dir = working_dir;
        }

        public Policy Create(PolicyParams pParams)
        {
            Policy policy = new Policy();
            var error = "";


            var policyKeyHash = this.GeneratePolicyKeyHash(pParams);

            if (CardanoCLI.HasError(policyKeyHash))
            {
                error = policyKeyHash;
                Console.WriteLine(error);
                return policy;
            }

            var policyScriptFile = this.CreatePolicyScriptFile(pParams, policyKeyHash);

            if (CardanoCLI.HasError(policyScriptFile))
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

        public string GeneratePolicyKeyHash(PolicyParams pParams)
        {
            var cmd = $"address key-hash --payment-verification-key-file {pParams.VerificationKeyFile}";
            var output = CardanoCLI.RunCLICommand(cmd);
            
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

            var currentSlot = CardanoCLI.QueryTip().Slot;

            if (pParams.TimeLimited) 
            {
                script = script.Replace("SLOT", (currentSlot + (pParams.ValidForMinutes * 60)).ToString());
            }
            try
            {   
                System.IO.File.WriteAllText($"{_working_dir}/{pParams.PolicyName}.script", script);
            }
            catch(Exception ex)
            {
                return $"CS.Error: {ex.Message}";
            }

            return $"{pParams.PolicyName}.script";
        }

        public static string GeneratePolicyId(string policyName)
        {
            var cmd = $"transaction policyid";
            cmd += " ";

            cmd += $"--script-file {policyName}.script";

            var output = CardanoCLI.RunCLICommand(cmd);

            return Regex.Replace(output, @"\s", "");
        }
    }
}
