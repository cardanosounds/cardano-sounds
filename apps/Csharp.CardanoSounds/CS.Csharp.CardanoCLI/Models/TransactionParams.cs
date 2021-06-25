using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Csharp.CardanoCLI.Models
{
    public class TransactionParams
    {
        public bool SendAllTxInAda { get; set; }

        public string TxInHash { get; set; }

        public int TxInLovelaceValue { get; set; }

        public int TxInIx { get; set; }

        public int LovelaceValue { get; set; }

        public string SenderAddress { get; set; }

        public string SendToAddress { get; set; }

        public string TxFileName { get; set; }

    }
}
