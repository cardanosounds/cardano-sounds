using CS.Csharp.CardanoCLI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.IO;
using Csharp.CardanoCLI.Models;

namespace CS.Csharp.CardanoCLI
{
    public class Transactions
    {
        private readonly string _incmd_newline = " ";
        private readonly CLI _cli;

        public Transactions(CLI cli)
        {
            _cli = cli;
        }

        public string SendBasicTransaction(TransactionParams txParams)
        {
            var tip = _cli.QueryTip().Slot;
            _cli._logger.Log("tip");
            _cli._logger.Log(tip.ToString());


            if(tip == 0 ) { return "Error querying tip."; }
            
            var ttl = tip + 5000;

            var prepare = PrepareTransaction(txParams, ttl);
            if (_cli.HasError(prepare)) { return "Error prepare: " + prepare; }

            var minFee = CalculateMinFee(txParams);
            if (_cli.HasError(minFee)) { return "Error minFee: " + minFee; }

            var build = BuildTransaction(txParams, Int64.Parse(minFee), ttl);
            if (_cli.HasError(build)) { return "Error build: " + build; }

            var sign = SignTransaction(txParams);
            if (_cli.HasError(sign)) { return "Error sign: " + sign; }

            var submit = SubmitTransaction(txParams);
            if (_cli.HasError(submit)) { return "Error submit: " + submit; }
            return submit;
        }

        public string PrepareTransaction(TransactionParams txParams, long invalidAfter, MintParams mintParams = null)
        {
            return BuildTransaction(txParams, 170000, invalidAfter, mintParams);
        }

        public string CalculateMinFee(TransactionParams txParams)
        {
            var cmd = @"transaction calculate-min-fee";
            cmd += _incmd_newline;

            var inputsCount = txParams.TransactionInputs.Count;
            cmd += $"--tx-in-count {inputsCount}";
            cmd += _incmd_newline;

            var outCount = txParams.TransactionOutputs.Count;
            cmd += $"--tx-out-count {outCount}";
            cmd += _incmd_newline;

            cmd += _cli._network;
            cmd += _incmd_newline;

            cmd += $"--tx-body-file {txParams.TxFileName}.raw";
            cmd += _incmd_newline;

            cmd += "--witness-count 0";
            cmd += _incmd_newline;

            if (!File.Exists(Path.Combine(_cli._working_directory, "protocol.json"))) _cli.SetProtocolParamaters();

            cmd += "--protocol-params-file protocol.json";

            _cli._logger.Log("CalculateMinFee");
            _cli._logger.Log(cmd);

            var output = _cli.RunCLICommand(cmd);

            return Regex.Replace(output, @"\s", "").Replace("Lovelace", "");
        }

        public string BuildTransaction(TransactionParams txParams, long minFee, long invalidAfter, MintParams mintParams = null)
        {
            var cmd = @"transaction build-raw";
            cmd += _incmd_newline;

            //All Input transactions 
            foreach (var txin in txParams.TransactionInputs)
            {
                cmd += $"--tx-in {txin.TxHash}#{txin.TxIx}";
                cmd += _incmd_newline;
            }

            //All Output transactions 
            foreach (var txout in txParams.TransactionOutputs)
            {
                cmd = TxOutput(minFee, mintParams, cmd, txout);
            }

            if (mintParams?.TokenParams?.Count > 0)
            {
                var policies = new Policies(_cli);

                cmd += "--mint=";

                foreach (var tokenMint in mintParams.TokenParams)
                {
                    var policyId = policies.GeneratePolicyId(tokenMint.PolicyName);
                    cmd += $"\"{tokenMint.TokenAmount} {policyId}.{tokenMint.TokenName}\"";

                    if (!tokenMint.Equals(mintParams.TokenParams.Last())) cmd += "+";
                }

                cmd += _incmd_newline;
                foreach (var policy in mintParams?.TokenParams?.Select(a => a.PolicyName)?.Distinct())
                {
                    cmd += $"--mint-script-file {policy}.script";
                    cmd += _incmd_newline;
                }
            }

            if (!String.IsNullOrEmpty(txParams.MetadataFileName))
            {
                if (mintParams?.TokenParams?.Count > 0) UpdatePolicyIdInMetadata(mintParams, txParams.MetadataFileName);

                cmd += $"--metadata-json-file {txParams.MetadataFileName}";
                cmd += _incmd_newline;
            }

            cmd += $"--invalid-hereafter {invalidAfter}";
            cmd += _incmd_newline;

            cmd += $"--fee {minFee}";
            cmd += _incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.raw";
            _cli._logger.Log(cmd);
            return _cli.RunCLICommand(cmd);
        }

        private string TxOutput(long minFee, MintParams mintParams, string cmd, TxOut txout)
        {
            var lovelaceOut = txout.Amount.FirstOrDefault(x => x.Unit == "lovelace").Quantity;

            if (txout.PaysFee) lovelaceOut -= minFee;

            cmd += $"--tx-out {txout.RecipientAddress}+{lovelaceOut}";

            foreach (TokenValue nativeToken in txout.Amount.Where(y => y.Unit != "lovelace"))
            {
                var tokenName = nativeToken.Unit;

                if (mintParams != null)
                {
                    var toMint = mintParams.TokenParams.FirstOrDefault(z => z.TokenName == tokenName);

                    if (toMint != null)
                    {
                        var policies = new Policies(_cli);
                        var policyId = policies.GeneratePolicyId(toMint.PolicyName);

                        tokenName = $"{ policyId }.{toMint.TokenName}";
                    }
                }

                cmd += $"+\"{nativeToken.Quantity} {tokenName}\"";

            }

            cmd += _incmd_newline;
            return cmd;
        }

        public string SignTransaction(TransactionParams txParams)
        {
            var cmd = @"transaction sign";
            cmd += _incmd_newline;

            cmd += $"--tx-body-file {txParams.TxFileName}.raw";
            cmd += _incmd_newline;

            cmd += $"--signing-key-file {txParams.SigningKeyFile}";
            cmd += _incmd_newline;

            cmd += _cli._network;
            cmd += _incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.signed";

            return _cli.RunCLICommand(cmd);
        }

        public string SubmitTransaction(TransactionParams txParams)
        {
            var cmd = @"transaction submit";
            cmd += _incmd_newline;

            cmd += $"--tx-file {txParams.TxFileName}.signed";
            cmd += _incmd_newline;

            cmd += _cli._network;

            return _cli.RunCLICommand(cmd);
        }

        public string GetTxIdBeforeSubmit(TransactionParams txParams)
        {
            var cmd = $"transaction txid --tx-file {txParams.TxFileName}.signed";
            return _cli.RunCLICommand(cmd);
        }

        public void UpdatePolicyIdInMetadata(MintParams mintParams, string metadatafile)
        {
            var policies = new Policies(_cli);
            foreach (var tokenMint in mintParams.TokenParams)
            {
                var policyId = policies.GeneratePolicyId(tokenMint.PolicyName);

                File.WriteAllText  
                (   //metadada json filePath
                    Path.Combine(_cli._working_directory, metadatafile), 
                    //write back edited metadada json as text
                    File.ReadAllText(Path.Combine(_cli._working_directory, metadatafile)).Replace(tokenMint.PolicyName, policyId)
                );
            }
            
        }
    }
}
