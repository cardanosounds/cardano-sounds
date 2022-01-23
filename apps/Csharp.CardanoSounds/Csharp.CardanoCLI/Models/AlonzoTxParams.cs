using CS.Csharp.CardanoCLI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Csharp.CardanoCLI.Models
{
    public class AlonzoTxParams
    {
        TransactionParams TxParams { get; set; }
        string ScriptFileIn { get; set; }
        string DatumInValue { get; set; }
        string RedeemerInValue { get; set; }
        string CollaterallIn { get; set; }
        string ChangeAddress { get; set; }
        string DatumHashOut { get; set; }
    }
}
