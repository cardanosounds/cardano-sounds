from azure.cosmos import CosmosClient, PartitionKey, exceptions
from base import Base
from models.transaction import Transaction

class Query:
	base = Base()

	def queryDb(self, container_name, query):
		import json
		container = self.base.get_existing_container(container_name=container_name)
		for item in container.query_items(
				query=query,
				enable_cross_partition_query=True):
			return(json.dumps(item, indent=True))

	def delete_data(self, container_name, query):
		container = self.base.get_container_client(container_name)
		for item in container.query_items(
				query=query,
				enable_cross_partition_query=True):
			container.delete_item(item)

	def insert_transaction(self, transaction: Transaction):
		container = self.base.get_container_client('transactions')
		container.upsert_item(transaction)
