using System;
using CS.Csharp.CardanoCLI;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
//using Csharp.CardanoCLI;

namespace CS.TokenMint
{
    class Program
    {
        static void Main(string[] args)
        {
            //CLI cli = new CLI 
            var readyTx = DB.Cosmos.Transactions.GetReadyToMintTransaction();


        }
    }
}
