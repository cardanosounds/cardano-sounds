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
        public readonly int _lovelace_buyprice = 18000000;
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
            var metaStart = @"{
  ""721"": {
    ""97de3506172e572d4e7ba9874af2616c41ae3027c9894fde2c484a62"": {";

            var metaEnd = @"}},
  ""20"" : {
    ""327ebb172812c24e20a82db0d391b5403f58f305f672aed8fbd48808"": {
        ""CSCT"": {
          ""icon"": ""https://app.cardanosounds.com/icons/csct.png"",
          ""ticker"": ""CSCT"",
          ""url"": ""https://cardanosounds.com"",
          ""version"": ""1.0""
        }
    }
  }
}";
            var nftMetaJsonString = File.ReadAllText(Path.Combine(_working_directory, "nftmetadatatemplate.json"));
            var nftMeta = "";
            _logger.LogInformation("Started mint for " + tx.Id);
            _logger.LogInformation("1");
            Console.WriteLine("Started mint for " + tx.Id);
            foreach(var nft in tx.Metadata)
            {
                var meta = nftMetaJsonString;
                nft.TokenName = "CSNFT" + nft.TokenName.Replace("CSNFT", "");
                
                // tx.Metadata.TokenName = "CSNFT" + tx.Id;
                // CreateNFTPolicy();
                Console.WriteLine("Started metadata for " +  nft.TokenName);
                // _logger.LogInformation("2");

                meta = meta.Replace("NFT_NAME", nft.TokenName);
                meta = meta.Replace("IPFS_AUDIO", nft.IpfsIdSound);
                meta = meta.Replace("ARWEAVE_AUDIO", nft.ArweaveIdSound);
                meta = meta.Replace("SOUND_PROBABILITY", nft.Probability.ToString());
                meta = meta.Replace("IPFS_PLAYER_PREVIEW", nft.PlayerImage);
                meta = meta.Replace("PLAYER_NAME", nft.Player);
                meta = meta.Replace("RARITY_COLOR", nft.Rarity);
                // _logger.LogInformation("3");
                // _logger.LogInformation(meta);
                //char[]
                string web = nft.ArweaveWebsiteUri;
                // string web = tx.Metadata.ArweaveWebsiteUri.Remove(0,5);
                // web = web.Remove(web.Length - 7, 7);
                meta = meta.Replace("ARWEAVE_WEBSITE_HASH", web.Replace("https://arweave.net/", ""));
                meta = meta.Replace("ARWEAVE_WEBSITE", web);
                meta = meta.Replace("TRANSACTION_HASH", tx.Tx_Hash);
                for (var i = 0; i < nft.Sounds.Length; i++)
                {
                    meta = meta.Replace("SOUND_" + (i + 1), nft.Sounds[i].Filename.Replace("/home/azureuser/cswaves/",""));
                }

                meta.Replace("signatures/", "signatures: ");
                meta.Replace("bass/", "bass: ");
                meta.Replace("drums/", "drums: ");
                meta.Replace("melodies/", "melody: ");
                meta.Replace("enriching-mid-rare/", "enriching: ");
                meta.Replace("enriching-rarest/", "enriching: ");
                meta.Replace("enriching-common/", "enriching: ");
            
                if(nft != tx.Metadata.Last()) meta += @",
        ";

                nftMeta += meta;
            Console.WriteLine("End metadata for " +  nft.TokenName);

            }

            File.WriteAllText(Path.Combine(_working_directory, "metadata_" + tx.Tx_Hash + ".json"), 
                metaStart + nftMeta + metaEnd);

            MintParams mintParams = CreateMintParamaters(tx);

            TransactionParams txParams = CreateTransactionParameters(tx);

            Assets assets = new Assets(_cli);

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
            tx.Submitted = DateTime.Now;
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
                        Amount = new List<TokenValue> {
                            new TokenValue(2000000 + tx.NftCount * 100000),
                            new TokenValue(10 * tx.NftCount, EncodeStringToHex("CSCT"))
                        }.Concat(tx.Metadata.Select(nft =>  new TokenValue(1, EncodeStringToHex(nft.TokenName)))).ToList()

                    },
                    new TxOut
                    {
                        RecipientAddress = "addr1qx0l7rcp9qkzyy53w5wkk55wgz0hpmst00revasatvrz3evp5y5y0lja4ujq7geynu5as5fcrtjcdju69pfsvv8hhdpq9ep7x9",
                        PaysFee = true,
                        Amount = new List<TokenValue>
                        {
                            new TokenValue(tx.NftCount * _lovelace_buyprice - (2000000 + tx.NftCount * 100000))
                        }
                    }
                },
            MetadataFileName = $"metadata_{tx.Tx_Hash}.json",
            SendAllTxsUnspentOutput = true,
            SigningKeyFile = _signing_key
        };

        private MintParams CreateMintParamaters(Models.FullTransaction tx) => new MintParams
        {
            TokenParams = new List<TokenParams>
                {
                    new TokenParams
                    {
                        PolicyName = "c-sound-mainnet-ft-policy",
                        TokenAmount = 10 * tx.NftCount,
                        TokenName = EncodeStringToHex("CSCT")
                    }
                }.Concat(tx.Metadata.Select(nft =>  new TokenParams 
                    { 
                        PolicyName = "c-sound-mainnet-nft-policy",
                        TokenAmount = 1,
                        TokenName = EncodeStringToHex(nft.TokenName)
                    }
                )).ToList()
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
