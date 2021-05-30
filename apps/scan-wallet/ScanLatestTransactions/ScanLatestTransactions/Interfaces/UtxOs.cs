using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ScanLatestTransactions.Interfaces
{
    public class UtxOs
    {
        [JsonPropertyName("inputs")]
        public List<IO> Inputs { get; set; }

        [JsonPropertyName("outputs")]
        public List<IO> Outputs { get; set; }

    }
}
