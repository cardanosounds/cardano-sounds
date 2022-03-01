using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Models
{
    public class FullTransaction : IncommingTransaction
    {
        [JsonProperty(PropertyName = "metadata")]
        public List<Metadata> Metadata { get; set; }

        [JsonProperty(PropertyName = "submitted")]
        public DateTime? Submitted { get; set; }

    }
}
