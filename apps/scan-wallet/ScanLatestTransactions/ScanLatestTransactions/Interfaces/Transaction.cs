using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ScanLatestTransactions.Interfaces
{
    public class Transaction
    {
        [JsonPropertyName("tx_hash")]
        public string TxHash { get; set; }

        [JsonPropertyName("output_index")]
        public int OutputIndex { get; set; }

        [JsonPropertyName("amount")]
        public List<TokenValue> Amount { get; set; }

        public string SenderAddress { get; set; }
    }
}
