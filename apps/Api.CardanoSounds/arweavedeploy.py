import subprocess

#this works on linux only - I am using expect script, which wouldn't work on Windows
#needed to bypass confirmations in arweave-deploy module
class ArweaveDeploy:

	#
	sounds_folder = ""
	deploy_file_script = "expect-ar-deploy-file.sh"

	def prepare_deploy_file_script(self, tx_hash):
		filename = self.sounds_folder + tx_hash + ".mp3"
		with open(self.deploy_file_script) as f:
			newText=f.read().replace('UPLOADPATH', filename)

		with open(self.deploy_file_script, "w") as f:
			f.write(newText)



	def deploy_sound(self, tx_hash):
		self.prepare_deploy_file_script(tx_hash)
		return subprocess.Popen("./" + self.deploy_file_script, shell=True, stdout=subprocess.PIPE).stdout.read()
