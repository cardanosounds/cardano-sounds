using CS.Csharp.CardanoCLI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.Csharp.CardanoCLI
{
    public class Policies
    {
        private static string _network;
        private static string _incmd_newline;
        private static string _working_dir;

        public Policies(string network, string working_dir, string incmd_newline = " ")
        {
            _network = network;
            _incmd_newline = incmd_newline;
            _working_dir = working_dir;
        }

        public Policy CreatePolicy(PolicyParams pParams)
        {
            Policy policy = new Policy();
            var error = "";

            var generateKeys = this.GeneratePolicySigningKeys(pParams);

            if(CardanoCLI.HasError(generateKeys))
            {
                error = generateKeys; 
                Console.WriteLine(error);
                return policy;
            }

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
            policy.SigningKeyFile = $"{pParams.PolicyName}.skey";
            policy.VerificationKeyFile = $"{pParams.PolicyName}.vkey";

            return policy;
        }

        public string GeneratePolicySigningKeys(PolicyParams pParams)
        {
            var cmd = $"address key-gen";
            cmd += _incmd_newline;

            cmd += $"--verification-key-file policy/{pParams.PolicyName}.vkey";
            cmd += _incmd_newline;

            cmd += $"--signing-key-file policy/{pParams.PolicyName}.skey";

            return CardanoCLI.RunCLICommand(cmd);
        }

        public string GeneratePolicyKeyHash(PolicyParams pParams)
        {
            var cmd = $"address key-hash";
            cmd += _incmd_newline;

            cmd = $"--payment-verification-key-file policies/{pParams.PolicyName}.vkey";

            return CardanoCLI.RunCLICommand(cmd);
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
            if (pParams.TimeLimited) script += @",{
                  ""type"": ""before"",
                  ""slot"": ""SLOT""}
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
                return ex.Message;
            }

            return $"{pParams.PolicyName}.script";
        }

    }
}
