using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Csharp.CardanoCLI.Models
{
    public class TransactionParams
    {

        public bool SendAllTxsUnspentOutput { get; set; }

        public List<TxIn> TransactionInputs { get; set; }

        public List<TxOut> TransactionOutputs { get; set; }

        public string TxFileName { get; set; }

        public string MetadataFileName { get; set; }

        public string SigningKeyFile { get; set; }
    }
}
