using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Csharp.CardanoCLI.Models
{
    public class TokenValue
    {
        public TokenValue(long quantity, string unit = "lovelace")
        {
            Unit = unit;
            Quantity = quantity;
        }
        public string Unit { get; set; }

        public long Quantity { get; set; }
    }
}
