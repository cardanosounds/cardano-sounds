from azure.cosmos import CosmosClient, PartitionKey, exceptions

class Base:
     
    # A simple class
    # attribute
    db_key = "cosmos_db_key"
    acc_uri = "cosmos_db_uri"
    db_name = "cstest"
    client = CosmosClient(acc_uri, credential=db_key)
    database = client.get_database_client(db_name)
 
    def create_or_get_container(self, container_name, partitionkey):
        try:
            container = self.database.create_container(id=container_name, partition_key=PartitionKey(path=f"/{partitionkey}"))
        except exceptions.CosmosResourceExistsError:
            container = self.database.get_container_client(container_name)
        except exceptions.CosmosHttpResponseError:
            raise
        return container

    def get_existing_container(self, container_name):
        return self.database.get_container_client(container_name) 
