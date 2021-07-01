import os
import requests
from models.transaction import Transaction
from arweavedeploy import ArweaveDeploy

class Upload:

	generated_sounds_folder = "F:/CSwaves/generated-sounds/"
	project_id = os.getenv('PROJECT_ID')

	def upload_sound(self, tx: Transaction):
		ipfs_resp = self.upload_to_ipfs(tx.tx_hash)
		print(ipfs_resp)
		ar_resp = self.upload_to_arweave(tx.tx_hash)
		print(ar_resp)


	def upload_to_ipfs(self, tx_hash):
		file_path = self.generated_sounds_folder + tx_hash + ".mp3"

		headers = {
			'project_id': f"{self.project_id}",
		}

		files = {
			'file': (file_path, open(file_path, 'rb')),
		}

		return requests.post('https://ipfs.blockfrost.io/api/v0/ipfs/add', headers=headers, files=files)	


	def upload_to_arweave(self, tx_hash):
		deployer = ArweaveDeploy()
		deployer.deploy_sound(tx_hash)
