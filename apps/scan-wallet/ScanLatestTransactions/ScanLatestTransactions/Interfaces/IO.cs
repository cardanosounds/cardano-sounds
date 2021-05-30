using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ScanLatestTransactions.Interfaces
{
    public class IO
    {
        [JsonPropertyName("address")]
        public string Address { get; set; }

        [JsonPropertyName("amount")]
        public List<TokenValue> Amount { get; set; }

    }
}
