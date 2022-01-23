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
        
        [JsonProperty(PropertyName = "tx_hash")]
        public string Tx_Hash { get; set; }
        
        [JsonProperty(PropertyName = "tx_index")]
        public string Tx_Index { get; set; }

        [JsonProperty(PropertyName = "output_index")]
        public int Output_Index { get; set; }

        [JsonProperty(PropertyName = "amount")]
        public List<TokenValue> Amount { get; set; }

        [JsonProperty(PropertyName = "sender_address")]
        public string SenderAddress { get; set; }

        [JsonProperty(PropertyName = "status")]
        public string Status { get; set; }

        [JsonProperty(PropertyName = "created")]
        public DateTime Created { get; set; }
    }
}
