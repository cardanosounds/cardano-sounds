using CS.Csharp.CardanoCLI;
using CS.Csharp.CardanoCLI.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
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

        public void MintFromTransaction()
        {
           
            var tx = DB.Cosmos.Transactions.GetReadyToMintTransaction();

            var meta = File.ReadAllText(Path.Combine(_working_directory, "metadatatemplate.json"));
            meta = meta.Replace("NFT_NAME", tx.Metadata.TokenName);
            meta = meta.Replace("IPFS_AUDIO", tx.Metadata.IpfsIdSound);
            meta = meta.Replace("ARWEAVE_AUDIO", tx.Metadata.ArweaveIdSound);
            meta = meta.Replace("SOUND_PROBABILITY", tx.Metadata.Probability.ToString());
            meta = meta.Replace("IPFS_PLAYER_PREVIEW", tx.Metadata.PlayerImage);
            meta = meta.Replace("PLAYER_NAME", tx.Metadata.Player);
            meta = meta.Replace("ARWEAVE_WEBSITE", tx.Metadata.ArweaveWebsiteUri.ToString());
            meta = meta.Replace("TRANSACTION_HASH", tx.Tx_Hash);
            for (var i = 0; i < tx.Metadata.Sounds.Length; i++)
            {
                meta = meta.Replace("SOUND_" + (i+1), tx.Metadata.Sounds[i].Filename);
            }

            File.WriteAllText(Path.Combine(_working_directory, "metadata_" + tx.Metadata.TokenName + ".json"), meta);
            //tx.Metadata.Sounds;

            var nftPolicyParams = new PolicyParams
            {
                PolicyName = "nftpolicy",
                TimeLimited = true,
                ValidForMinutes = 120,
                SigningKeyFile = "signing-key-2",
                VerificationKeyFile = "verification-key-2"
            };

            Policies policies = new Policies(cli);

            policies.Create(nftPolicyParams);

            var mintParams = new MintParams
            {
                TokenParams = new List<TokenParams>
                {
                    new TokenParams()
                    {
                        PolicyName = "nftpolicy",
                        TokenAmount = 1,
                        TokenName = tx.Metadata.TokenName
                    },
                    new TokenParams
                    {
                        PolicyName = "testtokenpolicy",
                        TokenAmount = 1,
                        TokenName = "CSCT"
                    }
                }
            };

            var txParams = new TransactionParams()
            {
                TxFileName = $"testmintfromtx",
                TransactionInputs = new List<TxIn>
                {
                    new TxIn
                    {
                        TxHash = "2ac398ce480c4b474f5edc88d8384baf4ed5f47e6e87c4e009e55b6e2865cac9",
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
                            new TokenValue(1, tx.Metadata.TokenName),
                            new TokenValue(1, "CSCT")
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
                MetadataFileName = $"metadata_{tx.Metadata.TokenName}.json",
                SendAllTxsUnspentOutput = true,
                SigningKeyFile = "signing-key-2"
            };

            Assets assets = new Assets(cli);

            Console.Write(assets.MintNativeTokens(new List<PolicyParams>()/*{ nftPolicyParams, tokenPolicyParams }*/, mintParams, txParams));

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
                SigningKeyFile = "signing-key-2",
                VerificationKeyFile = "verification-key-2"
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
                SigningKeyFile = "signing-key-2",
                VerificationKeyFile = "verification-key-2"
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
    }
}
