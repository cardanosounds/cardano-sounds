import os
import json
import subprocess

#this lib doesn't work on windows
from arweave.arweave_lib import Wallet, Transaction

#this class uses Linux specific commands
class ArweaveDeploy:

	wallet = Wallet("/home/azureuser/arweave-key")
	sounds_folder = "/home/azureuser/sounds"
	websites_folder = "/home/azureuser/websites"

	#expect also wouldn't work on win
	deploy_file_script = "expect-ar-deploy-site.sh"

	def prepare_webdeploy_file_script(self, Tx_Hash):
		webdir = os.path.join(self.websites_folder, Tx_Hash)
		filename = os.path.join(webdir, "index.html")
		
		with open(self.deploy_file_script) as f:
			newText=f.read().replace('UPLOADPATH', filename)

		with open(os.path.join(self.websites_folder, "webdeploy-" + Tx_Hash + ".sh"), "w") as f:
			f.write(newText)


	def deploy_website(self, Tx_Hash):
		self.prepare_webdeploy_file_script(Tx_Hash)

		#make deploy script executable 
		command = ["chmod", "u+x", os.path.join(self.websites_folder, "webdeploy-" + Tx_Hash + ".sh")]
		subprocess.run(command)
		outputlines = subprocess.Popen(os.path.join(self.websites_folder, "webdeploy-" + Tx_Hash + ".sh"), shell=True, stdout=subprocess.PIPE).stdout.readlines()
		line_n = len(outputlines)
		permawebUri = outputlines[line_n - 4].decode().replace("\\u001b[96m", "").replace("\\u001b[39m\\r\\n", "")
		permawebUri = permawebUri[5:]
		permawebUri = permawebUri[:len(permawebUri) - 7]
		return permawebUri

	

	def upload_sound_file(self, Tx_Hash):
		filepath = os.path.join(self.sounds_folder, Tx_Hash + ".mp3")
		with open(filepath , 'rb') as track:
			audio_string_data = track.read()
			
			transaction = Transaction(self.wallet, data=audio_string_data)
			transaction.add_tag('Content-Type', 'audio/mp3')
			transaction.sign()
			transaction.send()
			return transaction.id

