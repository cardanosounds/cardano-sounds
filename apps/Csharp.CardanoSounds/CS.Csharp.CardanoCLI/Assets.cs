using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.Csharp.CardanoCLI
{
    public class Assets
    {
        private static string _network;
        private static string _incmd_newline;
        private static string _signing_key;

        public Assets(string incmd_newline, string network, string signning_key)
        {
            _signing_key = signning_key;
            _network = network;
            _incmd_newline = incmd_newline;
        }


    }
}
