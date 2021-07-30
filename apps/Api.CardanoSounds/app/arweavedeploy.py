import os
import json
import subprocess

#this lib doesn't work on windows
from arweave.arweave_lib import Wallet, Transaction

#this class uses Linux specific commands
class ArweaveDeploy:

	wallet = Wallet("/home/azureuser/arweave-key-uJCW-t0cfLptFzJbD1dvei6eTsQQ8fAKuGhZmpDvutU.json")
	sounds_folder = "/home/azureuser/sounds"
	websites_folder = "/home/azureuser/websites"

	#expect also wouldn't work on win
	deploy_file_script = "expect-ar-deploy-site.sh"

	def prepare_webdeploy_file_script(self, tx_hash):
		webdir = os.path.join(self.websites_folder, tx_hash)
		filename = os.path.join(webdir, "index.html")
		
		with open(self.deploy_file_script) as f:
			newText=f.read().replace('UPLOADPATH', filename)

		with open(os.path.join(self.websites_folder, "webdeploy-" + tx_hash + ".sh"), "w") as f:
			f.write(newText)


	def deploy_website(self, tx_hash):
		self.prepare_webdeploy_file_script(tx_hash)

		#make deploy script executable 
		command = ["chmod", "u+x", os.path.join(self.websites_folder, "webdeploy-" + tx_hash + ".sh")]
		subprocess.run(command)
		outputlines = subprocess.Popen(os.path.join(self.websites_folder, "./webdeploy-" + tx_hash + ".sh"), shell=True, stdout=subprocess.PIPE).stdout.readlines()
		line_n = len(outputlines)
		return outputlines[line_n - 4].decode().replace("b\'\\x1b[96m\'", "").replace("\\x1b[39m\\r\\n\'", "")
	

	def upload_sound_file(self, tx_hash):
		filepath = os.path.join(self.sounds_folder, tx_hash + ".mp3")
		with open(filepath , 'rb') as track:
			audio_string_data = track.read()
			
			transaction = Transaction(self.wallet, data=audio_string_data)
			transaction.add_tag('Content-Type', 'audio/mp3')
			transaction.sign()
			transaction.send()
			return transaction.id

