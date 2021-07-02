import subprocess

#this lib unfortunately doesn't work on windows
from arweave.arweave_lib import Wallet, Transaction

class ArweaveDeploy:

	wallet = Wallet("arweave-key-uJCW-t0cfLptFzJbD1dvei6eTsQQ8fAKuGhZmpDvutU.json")
	sounds_folder = "F:\CSwaves\generated-sounds\\"
	websites_folder = "F:\CSwaves\generated-websites\\"

	#expect also wouldn't work on win
	deploy_file_script = "expect-ar-deploy-file.sh"

	def prepare_webdeploy_file_script(self, tx_hash):
		filename = self.websites_folder + tx_hash + ".html"
		with open(self.deploy_file_script) as f:
			newText=f.read().replace('UPLOADPATH', filename)

		with open(self.deploy_file_script, "w") as f:
			f.write(newText)


	def deploy_website(self, tx_hash):
		self.prepare_webdeploy_file_script(tx_hash)
		return subprocess.Popen("./" + self.deploy_file_script, shell=True, stdout=subprocess.PIPE).stdout.read()
	

	def upload_sound_file(self, tx_hash):
		with open(tx_hash + ".mp3" , 'rb') as track:
			audio_string_data = track.read()
			
			transaction = Transaction(self.wallet, data=audio_string_data)
			transaction.add_tag('Content-Type', 'audio/mp3')
			transaction.sign()
			return transaction.send()


