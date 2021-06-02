using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ScanLatestTransactions.Models
{
    public class Transaction
    {
        public string Tx_Hash { get; set; }

        public int Output_Index { get; set; }

        public List<TokenValue> Amount { get; set; }

        public string SenderAddress { get; set; }
    }
}
