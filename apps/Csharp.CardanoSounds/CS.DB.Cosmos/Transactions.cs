using CS.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Documents.Client;
using System;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

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

        public async Task<HttpStatusCode> Create(Transaction tx)
        {
            HttpStatusCode statusCode;

            Database cosmos = new Database();
            await cosmos.Setup();

            //await cosmos.txContainer.CreateItemAsync(tx, new PartitionKey(tx.Status));

            try
            {
                // Read the item to see if it exists
                ItemResponse<Transaction> txRes = await cosmos.txContainer.ReadItemAsync<Transaction>(tx.Id, new PartitionKey(tx.Status));
                statusCode = txRes.StatusCode;

                Console.WriteLine("Item in database with id: {0} already exists\n", txRes.Resource.Tx_Hash);
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                // Create an item in the container representing the Wakefield family. Note we provide the value of the partition key for this item, which is "Wakefield"
                tx.Created = DateTime.Now;
                ItemResponse<Transaction> txRes = await cosmos.txContainer.CreateItemAsync<Transaction>(tx, new PartitionKey(tx.Status));

                statusCode = txRes.StatusCode;

                // Note that after creating the item, we can access the body of the item with the Resource property off the ItemResponse. We can also access the RequestCharge property to see the amount of RUs consumed on this request.
                Console.WriteLine("Created item in database with id: {0} Operation consumed {1} RUs.\n", txRes.Resource.Tx_Hash, txRes.RequestCharge);
            }

            return statusCode;
        }

        public static string GetLastTx()
        {
            using (client = new DocumentClient(new Uri(EndpointUri), PrimaryKey))
            {
                var option = new FeedOptions { EnableCrossPartitionQuery = true };
                var tx = client.CreateDocumentQuery<Transaction>(
                UriFactory.CreateDocumentCollectionUri(DBName, "transactions"), option)
                .OrderByDescending(x => x.Created)
                .AsEnumerable().Select(y => y.Id)
                .FirstOrDefault();

                return tx == null ? "" : tx;
            }
        }
    }
}
