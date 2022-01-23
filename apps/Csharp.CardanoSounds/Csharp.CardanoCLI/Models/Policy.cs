using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.Csharp.CardanoCLI.Models
{
    public class Policy
    {
        public string VerificationKeyFile { get; set; }

        public string SigningKeyFile  { get; set; }

        public string PolicyKeyHash { get; set; }

        public string PolicyScriptFile { get; set; }
    }
}
