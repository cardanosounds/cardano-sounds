import os
import requests
import json
from pprint import pprint
from arweavedeploy import ArweaveDeploy

class Upload:

	generated_sounds_folder = "F:\CSwaves\generated-sounds"
	project_id = os.getenv('PROJECT_ID')


	def upload_to_ipfs(self, tx_hash):
		file_path = os.path.join(self.generated_sounds_folder, tx_hash + ".mp3")

		headers = {
			'project_id': f"{self.project_id}",
		}

		files = {
			'file': (file_path, open(file_path, 'rb')),
		}

		response = requests.post('https://ipfs.blockfrost.io/api/v0/ipfs/add', headers=headers, files=files)

		ipfs_hash = json.loads(response.text)['ipfs_hash']

		self.pin_to_ipfs(ipfs_hash)


	def pin_to_ipfs(self, ipfs_hash):
		headers = {
			'project_id': f"{self.project_id}",
		}

		requests.post(f'https://ipfs.blockfrost.io/api/v0/ipfs/pin/add/{ipfs_hash}', headers=headers)
		return ipfs_hash


	def upload_to_arweave(self, tx_hash):
		deployer = ArweaveDeploy()
		deployer.upload_sound_file(tx_hash)



