using CS.Csharp.CardanoCLI.Models;
using System.Collections.Generic;

namespace CS.Csharp.CardanoCLI.Models
{
    public class TxIn
    {
        public string TxHash { get; set; }

        public int TxIx { get; set; }

        public List<TokenValue> Amount { get; set; }

    }
}
