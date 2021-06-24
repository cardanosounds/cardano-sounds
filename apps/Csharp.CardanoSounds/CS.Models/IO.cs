using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CS.Models
{
    public class IO
    {
        public string Address { get; set; }

        public List<TokenValue> Amount { get; set; }

    }
}
