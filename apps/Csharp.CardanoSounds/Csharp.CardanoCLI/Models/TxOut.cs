using CS.Csharp.CardanoCLI.Models;
using System.Collections.Generic;

namespace CS.Csharp.CardanoCLI.Models
{
    public class TxOut
    {
        public string RecipientAddress { get; set; }

        public List<TokenValue> Amount { get; set; }

        public bool PaysFee { get; set; }

    }
}
