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
        private readonly CLI _cli;


        public Assets(CLI cli)
        {
            _cli = cli;
        }


        public string MintNativeTokens(List<PolicyParams> pParamsList, MintParams mintParams, TransactionParams txParams)
        {
            if (!ValidateTxParams(txParams, mintParams)) return "Error : Invalid transaction paramaters";

            if(pParamsList.Any())
            {
                Policies policiesUtils = new Policies(_cli);

                foreach (var pParams in pParamsList)
                {
                    var policy = policiesUtils.Create(pParams);

                    if (string.IsNullOrEmpty(policy.PolicyKeyHash)) { return "Error policy: " + policy; }
                }
            }
            
            Transactions transactions = new Transactions(_cli);

            var ttl = _cli.QueryTip().Slot + 3000;
            if(ttl < 3001) return "Error querying tip";  
            var prepare = transactions.PrepareTransaction(txParams, ttl, mintParams);
            if(_cli.HasError(prepare)) { return "Error prepare: " + prepare;  }
            
            var minFee = transactions.CalculateMinFee(txParams);
            if (_cli.HasError(minFee)) { return "Error minFee: " + minFee; }

            var build = transactions.BuildTransaction(txParams, Int64.Parse(minFee), ttl, mintParams);
            if (_cli.HasError(build)) { return "Error build: " + build; }

            var sign = transactions.SignTransaction(txParams);
            if (_cli.HasError(sign)) { return "Error sign: " + sign; }

            var submit = transactions.SubmitTransaction(txParams);
            if (_cli.HasError(submit)) { return "Error submit: " + submit; }

            return submit;
        }

        //TODO: COMPARE INPUT AND OUTPUT VALUES
        public bool ValidateTxParams(TransactionParams txParams, MintParams mintParams)
        {
            if (txParams.TransactionOutputs.Any()
                && txParams.TransactionOutputs.Where(x => x.PaysFee)?.Count() == 1)
            { 
                if(txParams.TransactionInputs.Any())
                {
                    var inputAmount = txParams.TransactionInputs.Select(x => x.Amount);
                    return true;
                }
                else
                {
                    _cli._logger.Warn("No transaction input");
                    return false;
                }
            }
            else
            {
                _cli._logger.Warn("One receiver needs to pay the fee.");
            }
            
            return false;
        }
    }
}
