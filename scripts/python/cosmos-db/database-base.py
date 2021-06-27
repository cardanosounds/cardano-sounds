from azure.cosmos import CosmosClient, PartitionKey, exceptions
import os

url = os.environ['ACCOUNT_URI']
key = os.environ['ACCOUNT_KEY']
client = CosmosClient(url, credential=key)
database_name = 'database'
database = client.get_database_client(database_name)
container_name = 'container'


def create_database():
	try:
		container = database.create_container(id=container_name, partition_key=PartitionKey(path="/productName"))
	except exceptions.CosmosResourceExistsError:
		container = database.get_container_client(container_name)
	except exceptions.CosmosHttpResponseError:
		raise

def create_container():
	try:
		container = database.create_container(id=container_name, partition_key=PartitionKey(path="/status"))
	except exceptions.CosmosResourceExistsError:
		container = database.get_container_client(container_name)
	except exceptions.CosmosHttpResponseError:
		raise

def get_existing_container():
	client = CosmosClient(url, credential=key)
	database_name = 'testDatabase'
	database = client.get_database_client(database_name)
	container_name = 'products'
	container = database.get_container_client(container_name)

