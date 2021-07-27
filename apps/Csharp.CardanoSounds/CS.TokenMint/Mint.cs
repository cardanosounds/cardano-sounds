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
    public class Mint : IMint
    {
        public readonly string _network = "--testnet-magic 1097911063"; //--mainnet
        public readonly string _cardano_cli_location = $"/home/azureuser/cardano-node-1.27.0/cardano-cli"; //.exe for windows
        public readonly string _working_directory = "/home/azureuser/cardano-node-1.27.0";
        private readonly CLI cli;

        public Mint(ILogger<Mint> logger)
        {
            cli = new CLI(_network, _cardano_cli_location, _working_directory, new CliLogger(logger));
        }

        public void MintFromDbTransaction()
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
                meta = meta.Replace("SOUND_" + (i + 1), tx.Metadata.Sounds[i].Filename);
            }

            File.WriteAllText(Path.Combine(_working_directory, "metadata_" + tx.Metadata.TokenName + ".json"), meta);

            MintParams mintParams = CreateMintParamaters(tx);

            TransactionParams txParams = CreateTransactionParameters(tx);

            Assets assets = new Assets(cli);

            Console.Write(assets.MintNativeTokens(
                new List<PolicyParams>(){ 
                    new PolicyParams
                    {
                        PolicyName = "nftpolicy",
                        TimeLimited = true,
                        ValidForMinutes = 120,
                        SigningKeyFile = "signing-key-2",
                        VerificationKeyFile = "verification-key-2"
                    }
                }, 
                mintParams, 
                txParams
                )
            );
        }

        private static TransactionParams CreateTransactionParameters(Models.FullTransaction tx) => new TransactionParams()
        {
            TxFileName = $"testmintfromtx",
            TransactionInputs = new List<TxIn>
                {
                    new TxIn
                    {
                        TxHash = tx.Tx_Hash,
                        TxIx = tx.Output_Index,
                        Amount = tx.Amount.Select(x => new TokenValue(x.Quantity, x.Unit)).ToList()
                    }
                },
            TransactionOutputs = new List<TxOut>
                {
                    new TxOut
                    {
                        RecipientAddress = tx.SenderAddress,
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

        private static MintParams CreateMintParamaters(Models.FullTransaction tx) => new MintParams
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

        private void CreateNFTPolicy()
        {
            Policies policies = new Policies(cli);

            policies.Create(new PolicyParams
            {
                PolicyName = "nftpolicy",
                TimeLimited = true,
                ValidForMinutes = 120,
                SigningKeyFile = "signing-key-2",
                VerificationKeyFile = "verification-key-2"
            });
        }
    }
}
