using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Models
{
    public class IncommingTransaction
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        public string Tx_Hash { get; set; }

        public int Output_Index { get; set; }

        public List<TokenValue> Amount { get; set; }

        public string SenderAddress { get; set; }

        [JsonProperty(PropertyName = "status")]
        public string Status { get; set; }

        public DateTime Created { get; set; }
    }
}
