using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ScanLatestTransactions.Models
{
    public class TokenValue
    {
        public string Unit { get; set; }

        public int Quantity { get; set; }
    }
}
