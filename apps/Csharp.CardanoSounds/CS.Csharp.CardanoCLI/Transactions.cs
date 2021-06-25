using CS.Csharp.CardanoCLI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.Csharp.CardanoCLI
{
    public class Transactions
    {
        private static string _network;
        private static string _incmd_newline;
        private static string _signing_key;

        public Transactions(string incmd_newline, string network, string signning_key)
        {
            _signing_key = signning_key;
            _network = network;
            _incmd_newline = incmd_newline;
        }

        public string PrepareTransaction(TransactionParams txParams, long ttl)
        {
            var cmd = @"transaction build-raw";
            cmd += _incmd_newline;

            //tx in
            cmd += $"--tx-in {txParams.TxInHash}#{txParams.TxInIx}";
            cmd += _incmd_newline;

            //send to - tx out
            cmd += $"--tx-out {txParams.SendToAddress}+{txParams.LovelaceValue}";
            cmd += _incmd_newline;

            //return change
            if (!txParams.SendAllTxInAda)
            {
                cmd += $"--tx-out {txParams.SenderAddress}+{txParams.TxInLovelaceValue - txParams.LovelaceValue}";
                cmd += _incmd_newline;
            }

            cmd += $"--ttl {ttl}";
            cmd += _incmd_newline;

            cmd += "--fee 170000";
            cmd += _incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.raw";

            return CardanoCLI.RunCLICommand(cmd);
        }

       
        public string CalculateMinFee(TransactionParams txParams, long ttl)
        {
            var cmd = @"transaction calculate-min-fee";
            cmd += _incmd_newline;

            cmd += "--tx-in-count 1";
            cmd += _incmd_newline;

            var outCount = txParams.SendAllTxInAda ? 1 : 2;
            cmd += $"--tx-out-count {outCount}";
            cmd += _incmd_newline;

            cmd += _network;
            cmd += _incmd_newline;

            cmd += $"--tx-body-file {txParams.TxFileName}.raw";
            cmd += _incmd_newline;

            cmd += "--witness-count 1";
            cmd += _incmd_newline;

            cmd += "--protocol-params-file protocol.json";

            return CardanoCLI.RunCLICommand(cmd);
        }

        public string BuildTransaction(TransactionParams txParams, long minFee, long ttl)
        {
            var cmd = @"transaction build-raw";
            cmd += _incmd_newline;

            //tx in
            cmd += $"--tx-in {txParams.TxInHash}#{txParams.TxInIx}";
            cmd += _incmd_newline;

            
            long lovelaceVal = txParams.SendAllTxInAda ? txParams.LovelaceValue - minFee : txParams.LovelaceValue;

            //send to - tx out 
            cmd += $"--tx-out {txParams.SendToAddress}+{lovelaceVal}";
            cmd += _incmd_newline;

            //return change - fee pays sender
            if (!txParams.SendAllTxInAda)
            {
                cmd += $"--tx-out {txParams.SenderAddress}+{txParams.TxInLovelaceValue - txParams.LovelaceValue - minFee}";
                cmd += _incmd_newline;
            }

            cmd += $"--ttl {ttl}";
            cmd += _incmd_newline;

            cmd += $"--fee {minFee}";
            cmd += _incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.raw";

            return CardanoCLI.RunCLICommand(cmd);
        }

        public string SignTransaction(TransactionParams txParams)
        {
            var cmd = @"transaction sign";
            cmd += _incmd_newline;

            cmd += $"--tx-body-file {txParams.TxFileName}.raw";
            cmd += _incmd_newline;

            cmd += $"--signing-key-file {_signing_key}";
            cmd += _incmd_newline;

            cmd += _network;
            cmd += _incmd_newline;

            cmd += $"--out-file {txParams.TxFileName}.signed";

            return CardanoCLI.RunCLICommand(cmd);
        }

        public string SubmitTransaction(TransactionParams txParams)
        {
            var cmd = @"transaction submit";
            cmd += _incmd_newline;

            cmd += $"--tx-file {txParams.TxFileName}.signed";
            cmd += _incmd_newline;

            cmd += _network;

            return CardanoCLI.RunCLICommand(cmd);

        }
    }
}
