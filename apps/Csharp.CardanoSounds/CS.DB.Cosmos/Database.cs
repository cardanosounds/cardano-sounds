using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text;
using System.Threading.Tasks;

namespace CS.DB.Cosmos
{
    public class Database
    {
        private static readonly string EndpointUri = ConfigurationManager.AppSettings["CosmosEndPointUri"];

        // The primary key for the Azure Cosmos account.
        private static readonly string PrimaryKey = ConfigurationManager.AppSettings["CosmosPrimaryKey"];

        // The name of new database in Azure Cosmos DB
        private static readonly string DBName = ConfigurationManager.AppSettings["CosmosDatabaseName"];

        // The Cosmos client instance
        public CosmosClient client;

        // The database we will create
        public Microsoft.Azure.Cosmos.Database database;

        // The container we will create.
        public  Container txContainer;
        public  Container metadataContainer;

        public static async Task Main(string[] args)
        {
            try
            {
                Console.WriteLine("Beginning operations...\n");
                Database cosmos = new Database();
                await cosmos.Setup();

            }
            catch (CosmosException de)
            {
                Exception baseException = de.GetBaseException();
                Console.WriteLine("{0} error occurred: {1}", de.StatusCode, de);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error: {0}", e);
            }
            finally
            {
                Console.WriteLine("End of program, press any key to exit.");
                Console.ReadKey();
            }
        }

        
        public async Task Setup()
        {
            Console.WriteLine("SETUP DB");
            CreateCosmosClient();
            Console.WriteLine("SETUP CLIENT");
            await CreateCosmosDatabase();
            Console.WriteLine("SETUP DB");
            await CreateTxContainer();
            Console.WriteLine("SETUP Container");

            //await CreateMetadataContainer();
        }

        private void CreateCosmosClient()
        {
            client = new CosmosClient(EndpointUri, PrimaryKey);
        }

        private async Task CreateCosmosDatabase()
        {
            database = await client.CreateDatabaseIfNotExistsAsync(DBName);
        }

        private async Task CreateTxContainer()
        {
            txContainer = await database.CreateContainerIfNotExistsAsync("transactions", "/tx_hash");
        }

        private async Task CreateMetadataContainer()
        {
            metadataContainer = await database.CreateContainerIfNotExistsAsync("metadata", "/id");
        }
    }
}
