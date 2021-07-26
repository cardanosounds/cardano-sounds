using CS.Csharp.CardanoCLI;
using CS.Csharp.CardanoCLI.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.TokenMint
{
    public class Examples : IExamples
    {
        public readonly string _network = "--testnet-magic 1097911063"; //--mainnet
        public readonly string _cardano_cli_location = $"/home/azureuser/cardano-node-1.27.0/cardano-cli"; //.exe for windows
        public readonly string _working_directory = "/home/azureuser/cardano-node-1.27.0";
        private readonly CLI cli;
        //private readonly ILogger<Examples> _logger;

        public Examples(ILogger<Examples> logger)
        {
            cli = new CLI(_network, _cardano_cli_location, _working_directory, new CliLogger(logger));
            //_logger = logger;
        }

        public void TestMintTokens()
        {
            TestCreatePolicies();

            var mintParams = new MintParams
            {
                TokenParams = new List<TokenParams>
                {
                    new TokenParams()
                    {
                        PolicyName = "testnftpolicy",
                        TokenAmount = 1,
                        TokenName = "CSTEST"
                    },
                    new TokenParams
                    {
                        PolicyName = "testtokenpolicy",
                        TokenAmount = 1,
                        TokenName = "CSNFTTEST"
                    }
                }
            };

            var txParams = new TransactionParams()
            {
                TxFileName = $"testpolicy",
                TransactionInputs = new List<TxIn>
                {
                    new TxIn
                    {
                        TxHash = "2089d4fda721c22e9c09670e13c5ddbd4616aad1d38769dfd4b2d6fb873f62d7",
                        TxIx = 0,
                        Amount = new List<TokenValue>
                        {
                            new TokenValue(5000000)
                        }

                    }
                },
                TransactionOutputs = new List<TxOut>
                {
                    new TxOut
                    {
                        RecipientAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
                        PaysFee = false,
                        Amount = new List<TokenValue>
                        {
                            new TokenValue(2000000),
                            new TokenValue(1, "CSTEST"),
                            new TokenValue(1, "CSNFTTEST")
                        }

                    },
                    new TxOut
                    {
                        RecipientAddress = "addr_test1vpl22c6vml7p7n5vv4n2mjf6sfw9kcse5c7jjk3uxc9dllcvvvj8q",
                        PaysFee = true,
                        Amount = new List<TokenValue>
                        {
                            new TokenValue(3000000)
                        }
                    }
                },
                MetadataFileName = "testmetadata.json",
                SendAllTxsUnspentOutput = true,
                SigningKeyFile = "signing-key-2"
            };

            Assets assets = new Assets(cli);

            Console.Write(assets.MintNativeTokens(new List<PolicyParams>()/*{ nftPolicyParams, tokenPolicyParams }*/, mintParams, txParams));

        }

        public void TestCreatePolicies()
        {
            Policies policies = new Policies(cli);

            var nftPolicyParams = new PolicyParams
            {
                PolicyName = "testnftpolicy",
                TimeLimited = true,
                ValidForMinutes = 120,
                SigningKeyFile = "signing-key",
                VerificationKeyFile = "verification-key"
            };


            var nftPolicy = policies.Create(nftPolicyParams);

            if (string.IsNullOrEmpty(nftPolicy.PolicyKeyHash))
            {
                Console.WriteLine("nft policy error");
            }
            else
            {
                Console.WriteLine("nft policy success");
            }

            var tokenPolicyParams = new PolicyParams
            {
                PolicyName = "testtokenpolicy",
                TimeLimited = false,
                SigningKeyFile = "signing-key",
                VerificationKeyFile = "verification-key"
            };

            var tokenPolicy = policies.Create(tokenPolicyParams);

            if (string.IsNullOrEmpty(tokenPolicy.PolicyKeyHash))
            {
                Console.WriteLine("token policy error");
            }
            else
            {
                Console.WriteLine("token policy success");
            }
        }

        //public void TestTransactionWithTokens()
        //{
        //    var txParams = new TransactionParams()
        //    {
        //        TxFileName = $"tx-tokens",
        //        LovelaceValue = 2000000,
        //        SendAllTxInAda = false,
        //        SenderAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
        //        SendToAddress = "addr_test1vpl22c6vml7p7n5vv4n2mjf6sfw9kcse5c7jjk3uxc9dllcvvvj8q",
        //        TxInLovelaceValue = 989477405,
        //        TxInHash = "e1c85be256a393cc341ba0353e257d921544892e8a6529a38e5204e1bab4a73e",
        //        TxInIx = 0,
        //        NativeTokensInUtxo = new List<NativeToken>(){
        //            new NativeToken{
        //                Amount = 1000,
        //                TokenFullName = "1986a6fba600525df58ad520bedaba94a8e7a297ea929a23cf230376.CSTEST"
        //            }
        //        },
        //        NativeTokensToSend = new List<NativeToken>(){
        //            new NativeToken{
        //                Amount = 1000,
        //                TokenFullName = "1986a6fba600525df58ad520bedaba94a8e7a297ea929a23cf230376.CSTEST"
        //            }
        //        },
        //        SigningKeyFile = "signing-key"
        //    };
        //    Transaction(txParams);
        //}

        //public void TestTransaction()
        //{
        //    var txParams = new TransactionParams()
        //    {
        //        TxFileName = $"tx2",
        //        LovelaceValue = 5000000,
        //        SendAllTxInAda = false,
        //        SenderAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
        //        SendToAddress = "addr_test1vpl22c6vml7p7n5vv4n2mjf6sfw9kcse5c7jjk3uxc9dllcvvvj8q",
        //        TxInLovelaceValue = 989477405,
        //        TxInHash = "7b8b5e3141b1239bf69e7513e599babc02a204602952abcac2fea226563712ab",
        //        TxInIx = 1
        //    };
        //    Transaction(txParams);
        //}


        //public void Transaction(TransactionParams txParams)
        //{
        //    var ttl = cli.QueryTip().Slot + 100;

        //    var transactions = new Transactions(txParams.SigningKeyFile, cli);

        //    var f = transactions.PrepareTransaction(txParams, ttl);
        //    Console.WriteLine(f);
        //    if (!f.StartsWith("CS.Error"))
        //    {
        //        var protocolParams = cli.SetProtocolParamaters();
        //        if (!cli.HasError(protocolParams))
        //        {
        //            var minFee = transactions.CalculateMinFee(txParams);
        //            if (!cli.HasError(minFee))
        //            {
        //                Console.WriteLine(minFee);
        //                var buildTx = transactions.BuildTransaction(txParams, (long)Convert.ToInt64(minFee.Replace(" Lovelace", "")), ttl);
        //                if (!cli.HasError(buildTx))
        //                {
        //                    var signTx = transactions.SignTransaction(txParams);
        //                    if (!cli.HasError(signTx))
        //                    {
        //                        var submit = transactions.SubmitTransaction(txParams);
        //                        Console.WriteLine(submit);
        //                        if (!cli.HasError(submit))
        //                        {
        //                            Console.WriteLine("Success!");
        //                        }
        //                    }
        //                    else
        //                    {
        //                        Console.WriteLine("SIGN ERROR: " + signTx);
        //                    }
        //                }
        //                else
        //                {
        //                    Console.WriteLine("BUILD ERROR: " + buildTx);
        //                }
        //            }
        //            else
        //            {
        //                Console.WriteLine("FEE CALC ERROR: " + minFee);
        //            }
        //        }
        //        else
        //        {
        //            Console.WriteLine("PROTOCOL PARAMS ERROR: " + protocolParams);
        //        }
        //    }
        //    else
        //    {
        //        Console.WriteLine("PREPARE ERROR: " + f);
        //    }
        //}

    }
}
