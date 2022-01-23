using CS.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Documents.Client;
using System;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace CS.DB.Cosmos
{
    public class Transactions
    {
        private static readonly string EndpointUri = ConfigurationManager.AppSettings["CosmosEndPointUri"];

        // The primary key for the Azure Cosmos account.
        private static readonly string PrimaryKey = ConfigurationManager.AppSettings["CosmosPrimaryKey"];

        // The name of new database in Azure Cosmos DB
        private static readonly string DBName = ConfigurationManager.AppSettings["CosmosDatabaseName"];

        //Reusable instance of DocumentClient which represents the connection to a DocumentDB endpoint
        private static DocumentClient client;

        private readonly ILogger _logger;

        public Transactions(ILogger logger)
        {
            _logger = logger;
        }

        public async Task<HttpStatusCode> Update(IncommingTransaction tx)
        {
            HttpStatusCode statusCode;

            Database cosmos = new Database();
            await cosmos.Setup();

            try
            {
                // tx.Created = DateTime.Now;
                ItemResponse<IncommingTransaction> txRes = await cosmos.txContainer.ReplaceItemAsync<IncommingTransaction>(tx, tx.Id, new PartitionKey(tx.Tx_Hash));

                statusCode = txRes.StatusCode;

                // Note that after creating the item, we can access the body of the item with the Resource property off the ItemResponse. We can also access the RequestCharge property to see the amount of RUs consumed on this request.
                _logger.LogInformation("Updated item in database with id: {0} Operation consumed {1} RUs.\n", txRes.Resource.Tx_Hash, txRes.RequestCharge);
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                // Read the item to see if it exists
                // ItemResponse<IncommingTransaction> txRes = await cosmos.txContainer.ReadItemAsync<IncommingTransaction>(tx.Id.ToString(), new PartitionKey(tx.Tx_Hash));
                 statusCode = HttpStatusCode.BadRequest;

                _logger.LogWarning("Item in database with id: {0} already exists\n", tx.Tx_Hash);
            }

            return statusCode;
        }

        public async Task<HttpStatusCode> Update(FullTransaction tx)
        {
            HttpStatusCode statusCode;

            Database cosmos = new Database();
            await cosmos.Setup();

            try
            {
                // tx.Created = DateTime.Now;
                ItemResponse<FullTransaction> txRes = await cosmos.txContainer.ReplaceItemAsync<FullTransaction>(tx, tx.Id, new PartitionKey(tx.Tx_Hash));

                statusCode = txRes.StatusCode;

                // Note that after creating the item, we can access the body of the item with the Resource property off the ItemResponse. We can also access the RequestCharge property to see the amount of RUs consumed on this request.
                _logger.LogInformation("Updated item in database with id: {0} Operation consumed {1} RUs.\n", txRes.Resource.Tx_Hash, txRes.RequestCharge);
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                // Read the item to see if it exists
                // ItemResponse<IncommingTransaction> txRes = await cosmos.txContainer.ReadItemAsync<IncommingTransaction>(tx.Id.ToString(), new PartitionKey(tx.Tx_Hash));
                 statusCode = HttpStatusCode.BadRequest;

                _logger.LogWarning("Item in database with id: {0} already exists\n", tx.Tx_Hash);
            }

            return statusCode;
        }


        public async Task<HttpStatusCode> Create(IncommingTransaction tx)
        {
            HttpStatusCode statusCode;

            Database cosmos = new Database();
            await cosmos.Setup();

            try
            {
                // Create an item in the container representing the Wakefield family. Note we provide the value of the partition key for this item, which is "Wakefield"
                tx.Created = DateTime.Now;
                ItemResponse<IncommingTransaction> txRes = await cosmos.txContainer.CreateItemAsync<IncommingTransaction>(tx, new PartitionKey(tx.Tx_Hash));

                statusCode = txRes.StatusCode;

                // Note that after creating the item, we can access the body of the item with the Resource property off the ItemResponse. We can also access the RequestCharge property to see the amount of RUs consumed on this request.
                _logger.LogInformation("Created item in database with id: {0} Operation consumed {1} RUs.\n", txRes.Resource.Tx_Hash, txRes.RequestCharge);
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                // Read the item to see if it exists
                ItemResponse<IncommingTransaction> txRes = await cosmos.txContainer.ReadItemAsync<IncommingTransaction>(tx.Id.ToString(), new PartitionKey(tx.Tx_Hash));
                statusCode = txRes.StatusCode;

                _logger.LogWarning("Item in database with id: {0} already exists\n", txRes.Resource.Tx_Hash);
            }

            return statusCode;
        }

        public IncommingTransaction GetLastTx()
        {
            try 
            {
                using (client = new DocumentClient(new Uri(EndpointUri), PrimaryKey))
                {
                    var option = new FeedOptions { EnableCrossPartitionQuery = true };
                    var tx = client.CreateDocumentQuery<IncommingTransaction>(
                    UriFactory.CreateDocumentCollectionUri(DBName, "transactions"), option)
                    .OrderByDescending(x => x.Created)
                    .AsEnumerable()
                    .FirstOrDefault();

                    return tx;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;
            }
        }

        public List<TxStatus> GetDbTransactionsDataForIncomming(IncommingTransaction tx)
        {
            Console.WriteLine("GetDbTransactionsDataForIncomming");
            Console.WriteLine(tx.Tx_Hash);
            using (client = new DocumentClient(new Uri(EndpointUri), PrimaryKey))
            {
                var option = new FeedOptions { EnableCrossPartitionQuery = true };
                var dbTx = client.CreateDocumentQuery<IncommingTransaction>(
                UriFactory.CreateDocumentCollectionUri(DBName, "transactions"), option)
                .Where(x => x.Tx_Hash == tx.Tx_Hash)
                .OrderBy(x => x.Created)
                .AsEnumerable()
                .Select(x => new TxStatus(x.Id, x.Tx_Hash, x.Output_Index, x.Status, x.Created))
                .ToList();

                foreach(var id in dbTx.Select(x => x.Id.ToString()))
                {
                    Console.WriteLine("dbid");
                    Console.WriteLine(id);
                }

                Console.WriteLine("GetDbTransactionsDataForIncommingEND");
                Console.WriteLine(tx.Tx_Hash);


                return dbTx;
            }
        }

        public int GetTxCount()
        {
            try 
            {
                using (client = new DocumentClient(new Uri(EndpointUri), PrimaryKey))
                {
                    var option = new FeedOptions { EnableCrossPartitionQuery = true };
                    var txCount = client.CreateDocumentQuery<IncommingTransaction>(
                    UriFactory.CreateDocumentCollectionUri(DBName, "transactions"), option)
                    .AsEnumerable()
                    .Count();

                    return txCount;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return 0;
            }
        }

        public FullTransaction GetReadyToMintTransaction()
        {
            using (client = new DocumentClient(new Uri(EndpointUri), PrimaryKey))
            {
                var option = new FeedOptions { EnableCrossPartitionQuery = true };
                var tx = client.CreateDocumentQuery<FullTransaction>(
                UriFactory.CreateDocumentCollectionUri(DBName, "transactions"), option)
                .Where(x => x.Status == "generated")
                .OrderBy(x => x.Created)
                .AsEnumerable()
                .FirstOrDefault();

                return tx;
            }
        }

        public FullTransaction GetInvalidTransaction()
        {
            using (client = new DocumentClient(new Uri(EndpointUri), PrimaryKey))
            {
                var option = new FeedOptions { EnableCrossPartitionQuery = true };
                var tx = client.CreateDocumentQuery<FullTransaction>(
                UriFactory.CreateDocumentCollectionUri(DBName, "transactions"), option)
                .Where(x => x.Status == null || x.Status == "failed" || x.Status == "invalid")
                .OrderBy(x => x.Created)
                .AsEnumerable()
                .FirstOrDefault();

                return tx;
            }
        }
    }
}
