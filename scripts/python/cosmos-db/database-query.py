from azure.cosmos import CosmosClient, PartitionKey, exceptions
import os

url = os.environ['ACCOUNT_URI']
key = os.environ['ACCOUNT_KEY']
client = CosmosClient(url, credential=key)
database_name = 'database'
database = client.get_database_client(database_name)
container_name = 'container'


def insert_data():
	client = CosmosClient(url, credential=key)
	database_name = 'testDatabase'
	database = client.get_database_client(database_name)
	container_name = 'products'
	container = database.get_container_client(container_name)

	for i in range(1, 10):
		container.upsert_item({
			'id': 'item{0}'.format(i),
			'productName': 'Widget',
			'productModel': 'Model {0}'.format(i)
			}
		)

def query_db():
	import json
	database = client.get_database_client(database_name)
	container_name = 'products'
	container = database.get_container_client(container_name)
	for item in container.query_items(
       			query='SELECT * FROM mycontainer r WHERE r.id="item3"',
        		enable_cross_partition_query=True):
    		print(json.dumps(item, indent=True))

def delete_data():
	database = client.get_database_client(database_name)
	container = database.get_container_client(container_name)
	for item in container.query_items(
			query='SELECT * FROM products p WHERE p.productModel = "Model 2"',
			enable_cross_partition_query=True):
		container.delete_item(item, partition_key='Widget')
