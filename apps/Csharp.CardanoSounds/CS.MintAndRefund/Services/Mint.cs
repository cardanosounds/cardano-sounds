using CS.Csharp.CardanoCLI;
using CS.Csharp.CardanoCLI.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CS.MintAndRefund.Interfaces;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace CS.MintAndRefund.Services
{
    public class Mint : IMint
    {
        public readonly string _network = ConfigurationManager.AppSettings["CLI_NETWORK"];//"--testnet-magic 1097911063"; //--mainnet
        public readonly string _cardano_cli_location = ConfigurationManager.AppSettings["CLI_PATH"];//$"/home/azureuser/cardano-node-1.27.0/cardano-cli"; //.exe for windows
        public readonly string _working_directory = ConfigurationManager.AppSettings["CLI_WORKING_DIR"];//"/home/azureuser/cardano-node-1.27.0";
        public readonly string _signing_key = ConfigurationManager.AppSettings["CLI_SIGNING_KEY"];
        public readonly string _verif_key = ConfigurationManager.AppSettings["CLI_VERIFICATION_KEY"];
        private readonly CLI _cli;
        private readonly ILogger<Mint> _logger;

        private readonly CS.DB.Cosmos.Transactions _dbTransactions; 

        public Mint(ILogger<Mint> logger)
        {
            _cli = new CLI(_network, _cardano_cli_location, _working_directory, new CliLogger(logger));
            _dbTransactions = new CS.DB.Cosmos.Transactions(logger);
            _logger = logger;
        }

        public async Task MintFromDbTransaction()
        {
            var tx = _dbTransactions.GetReadyToMintTransaction();
            
            if (tx == null)
            {
                _logger.LogTrace("No records to mint, waiting 5 sec");
                await Task.Delay(TimeSpan.FromSeconds(5));               
                return;
            }
            _logger.LogInformation("Started mint for " + tx.Id);
            _logger.LogInformation("1");
            tx.Metadata.TokenName = "CSNFT" + tx.Id;
            // CreateNFTPolicy();
            _logger.LogInformation("2");

            var meta = File.ReadAllText(Path.Combine(_working_directory, "metadatatemplate.json"));
            meta = meta.Replace("NFT_NAME", tx.Metadata.TokenName);
            meta = meta.Replace("IPFS_AUDIO", tx.Metadata.IpfsIdSound);
            meta = meta.Replace("ARWEAVE_AUDIO", tx.Metadata.ArweaveIdSound);
            meta = meta.Replace("SOUND_PROBABILITY", tx.Metadata.Probability.ToString());
            meta = meta.Replace("IPFS_PLAYER_PREVIEW", tx.Metadata.PlayerImage);
            meta = meta.Replace("PLAYER_NAME", tx.Metadata.Player);
            meta = meta.Replace("RARITY_COLOR", tx.Metadata.Rarity);
            _logger.LogInformation("3");
            _logger.LogInformation(meta);
            //char[]
            string web = tx.Metadata.ArweaveWebsiteUri;
            // string web = tx.Metadata.ArweaveWebsiteUri.Remove(0,5);
            // web = web.Remove(web.Length - 7, 7);
            meta = meta.Replace("ARWEAVE_WEBSITE", web);
            meta = meta.Replace("TRANSACTION_HASH", tx.Tx_Hash);
            for (var i = 0; i < tx.Metadata.Sounds.Length; i++)
            {
                meta = meta.Replace("SOUND_" + (i + 1), tx.Metadata.Sounds[i].Filename.Replace("/home/azureuser/cswaves/",""));
            }

            meta.Replace("signatures/", "signatures: ");
            meta.Replace("bass/", "bass: ");
            meta.Replace("drums/", "drums: ");
            meta.Replace("melodies/", "melody: ");
            meta.Replace("enriching-mid-rare/", "enriching: ");
            meta.Replace("enriching-rarest/", "enriching: ");
            meta.Replace("enriching-common/", "enriching: ");

            _logger.LogInformation("4");

            File.WriteAllText(Path.Combine(_working_directory, "metadata_" + tx.Metadata.TokenName + ".json"), meta);

            MintParams mintParams = CreateMintParamaters(tx);

            TransactionParams txParams = CreateTransactionParameters(tx);

            Assets assets = new Assets(_cli);
            _logger.LogInformation("5");

            try 
            {
                var mintOutput = assets.MintNativeTokens(
                    new List<PolicyParams>(), 
                    mintParams, 
                    txParams
                    );
                if(mintOutput.ToUpper().Contains("ERROR"))
                { 
                    tx.Status = "failed mint";
                    _logger.LogError("failed mint: ");
                    _logger.LogError(mintOutput);

                } 
                else
                { 
                    tx.Status = "finished";
                     _logger.LogInformation("finished mint: ");
                    _logger.LogInformation(mintOutput);
                }
            }
            catch(Exception ex){
                _logger.LogError(ex, ex.Message);
                tx.Status = "failed mint";
            }
            
            await _dbTransactions.Update(tx);

        }

        private TransactionParams CreateTransactionParameters(Models.FullTransaction tx) => new TransactionParams()
        {
            TxFileName = $"{tx.Tx_Hash}.mint",
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
                            new TokenValue(1, EncodeStringToHex(tx.Metadata.TokenName)),
                            new TokenValue(10, EncodeStringToHex("CSCT"))
                        }

                    },
                    new TxOut
                    {
                        RecipientAddress = "addr1qx0l7rcp9qkzyy53w5wkk55wgz0hpmst00revasatvrz3evp5y5y0lja4ujq7geynu5as5fcrtjcdju69pfsvv8hhdpq9ep7x9",
                        PaysFee = true,
                        Amount = new List<TokenValue>
                        {
                            new TokenValue(13000000)
                        }
                    }
                },
            MetadataFileName = $"metadata_{tx.Metadata.TokenName}.json",
            SendAllTxsUnspentOutput = true,
            SigningKeyFile = _signing_key
        };

        private MintParams CreateMintParamaters(Models.FullTransaction tx) => new MintParams
        {
            TokenParams = new List<TokenParams>
                {
                    new TokenParams()
                    {
                        PolicyName = "c-sound-mainnet-nft-policy",
                        TokenAmount = 1,
                        TokenName = EncodeStringToHex(tx.Metadata.TokenName)
                    },
                    new TokenParams
                    {
                        PolicyName = "c-sound-mainnet-ft-policy",
                        TokenAmount = 10,
                        TokenName = EncodeStringToHex("CSCT")
                    }
                }
        };

        private string EncodeStringToHex(string input)
        {
            byte[] ba = Encoding.Default.GetBytes(input);

            var hexString = BitConverter.ToString(ba);

            return hexString.Replace("-", "");
        }


        private void CreateNFTPolicy()
        {
            Policies policies = new Policies(_cli);

            policies.Create(new PolicyParams
            {
                PolicyName = "newtesttokenpolicy",
                TimeLimited = false,
                SigningKeyFile = _signing_key,
                VerificationKeyFile = _verif_key
            });

             policies.Create(new PolicyParams
            {
                PolicyName = "newtestnftpolicy",
                TimeLimited = true,
                ValidForMinutes = 180000,
                SigningKeyFile = _signing_key,
                VerificationKeyFile = _verif_key
            });
        }
    }
}
