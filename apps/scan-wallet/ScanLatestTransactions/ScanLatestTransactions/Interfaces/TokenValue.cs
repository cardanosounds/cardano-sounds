using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ScanLatestTransactions.Interfaces
{
    public class TokenValue
    {
        [JsonPropertyName("unit")]
        public string Unit { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }
    }
}
