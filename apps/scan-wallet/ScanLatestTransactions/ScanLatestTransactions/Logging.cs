using System;
using System.Collections.Generic;
using System.Text;

namespace ScanLatestTransactions
{
    public static class Logging
    {
        public static void Log(string message, int level = 0)
        {
            Console.WriteLine(level + " : " + message);
        }

        public static void Error(string message)
        {
            Log(message, 4);
        }
    }
}
