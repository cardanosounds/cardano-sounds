using CS.Csharp.CardanoCLI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS.Csharp.CardanoCLI
{
    public class Examples
    {
        private static string _network;
        private static string _incmd_newline;
        private static string _signing_key;
        private static string _working_dir;


        public Examples(string network, string signing_key, string working_dir, string incmd_newline = " ")
        {
            _signing_key = signing_key;
            _network = network;
            _incmd_newline = incmd_newline;
            _working_dir = working_dir;
        }


        public void TestMintTokens()
        {
            var mintParams = new MintParams
            {
                PolicyName = "testpolicy",
                TokenAmount = 1000,
                TokenName = "CSTEST"
            };

            var policyParams = new PolicyParams
            {
                PolicyName = "testpolicy",
                TimeLimited = true,
                ValidForMinutes = 20
            };

            var txParams = new TransactionParams()
            {
                TxFileName = $"testmint-tx",
                LovelaceValue = 5000000,
                SendAllTxInAda = false,
                SenderAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
                SendToAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
                TxInLovelaceValue = 989650078,
                TxInHash = "37626db011baf6c4900bd8fb1a010fea3003b19067f88c46c391c77e4c4f5948",
                TxInIx = 1
            };

            Assets assets = new Assets(_network, _working_dir);

            Console.Write(assets.MintNativeTokens(policyParams, mintParams, txParams));

        }

        public void TestCreatePolicy()
        {
            Policies policies = new Policies(_network, _working_dir);

            var policyParams = new PolicyParams
            {
                PolicyName = "testpolicy1",
                TimeLimited = true,
                ValidForMinutes = 20
            };

            var policy = policies.Create(policyParams);

            if (string.IsNullOrEmpty(policy.PolicyKeyHash))
            {
                Console.WriteLine("error");
            }
            else
            {
                Console.WriteLine("success");
            }
        }

        public void TestTransaction()
        {
            var initialAda = 994825039;


            var txParams = new TransactionParams()
            {
                TxFileName = $"tx2",
                LovelaceValue = 5000000,
                SendAllTxInAda = false,
                SenderAddress = "addr_test1vrw3r08naaq8wrtemegjk7p3e9zp7a2ceul9rd84pd3nckcynl6xq",
                SendToAddress = "addr_test1vpl22c6vml7p7n5vv4n2mjf6sfw9kcse5c7jjk3uxc9dllcvvvj8q",
                TxInLovelaceValue = initialAda,
                TxInHash = "7b8b5e3141b1239bf69e7513e599babc02a204602952abcac2fea226563712ab",
                TxInIx = 1
            };

            var ttl = CardanoCLI.QueryTip().Slot + 100;

            var transactions = new Transactions(_incmd_newline, _network, _signing_key);

            var f = transactions.PrepareTransaction(txParams, ttl);
            Console.WriteLine(f);
            if (!f.StartsWith("CS.Error"))
            {
                var protocolParams = CardanoCLI.SetProtocolParamaters();
                if (!CardanoCLI.HasError(protocolParams))
                {
                    var minFee = transactions.CalculateMinFee(txParams, ttl);
                    if (!CardanoCLI.HasError(minFee))
                    {
                        Console.WriteLine(minFee);
                        var buildTx = transactions.BuildTransaction(txParams, (long)Convert.ToInt64(minFee.Replace(" Lovelace", "")), ttl);
                        if (!CardanoCLI.HasError(buildTx))
                        {
                            var signTx = transactions.SignTransaction(txParams);
                            if (!CardanoCLI.HasError(signTx))
                            {
                                var submit = transactions.SubmitTransaction(txParams);
                                Console.WriteLine(submit);
                                if (!CardanoCLI.HasError(submit))
                                {
                                    Console.WriteLine("Success!");
                                }
                            }
                            else
                            {
                                Console.WriteLine("SIGN ERROR: " + signTx);
                            }
                        }
                        else
                        {
                            Console.WriteLine("BUILD ERROR: " + buildTx);
                        }
                    }
                    else
                    {
                        Console.WriteLine("FEE CALC ERROR: " + minFee);
                    }
                }
                else
                {
                    Console.WriteLine("PROTOCOL PARAMS ERROR: " + protocolParams);
                }
            }
            else
            {
                Console.WriteLine("PREPARE ERROR: " + f);
            }
        }

    }
}
