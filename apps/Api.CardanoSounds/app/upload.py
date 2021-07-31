import os
import requests
import json
from pprint import pprint
from app.arweavedeploy import ArweaveDeploy

class Upload:

	generated_sounds_folder = "/home/azureuser/sounds"
	project_id = os.getenv('PROJECT_ID')


	def upload_to_ipfs(self, Tx_Hash):
		file_path = os.path.join(self.generated_sounds_folder, Tx_Hash + ".mp3")

		headers = {
			'project_id': f"{self.project_id}",
		}

		files = {
			'file': (file_path, open(file_path, 'rb')),
		}

		response = requests.post('https://ipfs.blockfrost.io/api/v0/ipfs/add', headers=headers, files=files)
		ipfs_hash = json.loads(response.text)['ipfs_hash']

		return self.pin_to_ipfs(ipfs_hash)


	def pin_to_ipfs(self, ipfs_hash):
		headers = {
			'project_id': f"{self.project_id}",
		}

		requests.post(f'https://ipfs.blockfrost.io/api/v0/ipfs/pin/add/{ipfs_hash}', headers=headers)
		return ipfs_hash


	def upload_to_arweave(self, Tx_Hash):
		deployer = ArweaveDeploy()
		return deployer.upload_sound_file(Tx_Hash)



