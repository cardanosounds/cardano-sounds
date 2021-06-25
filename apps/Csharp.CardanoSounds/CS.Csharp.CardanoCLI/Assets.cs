using CS.Csharp.CardanoCLI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.Csharp.CardanoCLI
{
    public class Assets
    {
        private string _network;
        private string _incmd_newline;
        private string _working_dir;

        public Assets(string network, string working_dir, string incmd_newline = " ")
        {
            _network = network;
            _incmd_newline = incmd_newline;
            _working_dir = working_dir;
        }


        public string MintNativeTokens(PolicyParams pParams, MintParams mintParams, TransactionParams txParams)
        {
            Policies policies = new Policies(_network, _working_dir);

            var policy = policies.Create(pParams);
            if (string.IsNullOrEmpty(policy.PolicyKeyHash)) { return "Error policy: " + policy; }

            Transactions transactions = new Transactions(_network, $"{pParams.PolicyName}.skey");

            var ttl = CardanoCLI.QueryTip().Slot + 120;

            var prepare = transactions.PrepareTransaction(txParams, ttl, mintParams);
            if(CardanoCLI.HasError(prepare)) { return "Error prepare: " + prepare;  }
            
            var minFee = transactions.CalculateMinFee(txParams, ttl);
            if (CardanoCLI.HasError(minFee)) { return "Error minFee: " + prepare; }

            var build = transactions.BuildTransaction(txParams, Int64.Parse(minFee), ttl, mintParams);
            if (CardanoCLI.HasError(minFee)) { return "Error build: " + build; }

            var sign = transactions.SignTransaction(txParams, $"{pParams.PolicyName}.skey");
            if (CardanoCLI.HasError(minFee)) { return "Error sign: " + sign; }

            var submit = transactions.SubmitTransaction(txParams);
            if (CardanoCLI.HasError(minFee)) { return "Error submit: " + submit; }

            return submit;
        }
    }
}
