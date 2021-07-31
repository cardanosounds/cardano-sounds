import json
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from app.db.base import Base
import jsonpickle

from app.models.metadata import Metadata
from app.models.transaction import Transaction
from app.models.soundprobability import SoundProbability

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
		container = self.base.get_existing_container(container_name)
		for item in container.query_items(
				query=query,
				enable_cross_partition_query=True):
			container.delete_item(item)

	def insert_metadata(self, metadata: Metadata):
		container = self.base.get_existing_container('metadata')
		metadata = jsonpickle.encode(metadata)
		container.create_item(json.loads(metadata))

	def insert_transaction(self, tx: Transaction):
		container = self.base.get_existing_container('transactions')
		tx = jsonpickle.encode(tx)
		container.create_item(json.loads(tx))

	def update_transaction(self, tx: Transaction):
		container = self.base.get_existing_container('transactions')
		# Query a document
		read_item = container.read_item(item=tx.id, partition_key=tx.Tx_Hash)

		read_item.metadata = tx.metadata
		return container.replace_item(item=read_item, body=read_item)

		