import os
import subprocess

#this lib unfortunately doesn't work on windows
from arweave.arweave_lib import Wallet, Transaction

#this class uses Linux specific commands
class ArweaveDeploy:

	wallet = Wallet("arweave-key-uJCW-t0cfLptFzJbD1dvei6eTsQQ8fAKuGhZmpDvutU.json")
	sounds_folder = "/home/dzcodes/sounds/"
	websites_folder = "/home/dzcodes/websites/"

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
		return subprocess.Popen(os.path.join(self.websites_folder, "./webdeploy-" + tx_hash + ".sh"), shell=True, stdout=subprocess.PIPE).stdout.read()
	

	def upload_sound_file(self, tx_hash):
		with open(tx_hash + ".mp3" , 'rb') as track:
			audio_string_data = track.read()
			
			transaction = Transaction(self.wallet, data=audio_string_data)
			transaction.add_tag('Content-Type', 'audio/mp3')
			transaction.sign()
			return transaction.send()


ad = ArweaveDeploy()
print(ad.deploy_website("randomTxHash000000111122222333344445555666677777888889999"))