import os
from app.models.metadata import Metadata
import quantumrandom

class Websites:
	sounds_folder = "/home/azureuser/sounds"
	websites_folder = "/home/azureuser/websites"
	base_sounds_folder = "/home/azureuser/soundclips/cswaves/"
	template_html = "/home/azureuser/nft-web-templates/index.html"
	glitch_template_sketch = "/home/azureuser/nft-web-templates/glitch-sketch.js"
	color_template_sketch = "/home/azureuser/nft-web-templates/color-sketch.js"
	randomdancers_template_sketch = "/home/azureuser/nft-web-templates/randomdancers-sketch.js"
	superformula_template_sketch = "/home/azureuser/nft-web-templates/superformula-sketch.js"
	dark_image = "ipfs://QmXcuQJNP5Sz4bc8nRVvGdG6t3k3X6K4uHRvuatXocjbLJ"
	light_image = "ipfs://QmSBH3pZiRMQF5b2jQCXYFK8hg45mjT71uWTMe5LFScYXm"

	def build_sketch(self, arweave_sound: str):		
		playersketch, player = self.choose_player()

		modeNum = int(round(quantumrandom.randint(0,7)))

		with open(playersketch) as f:
			sketch=f.read().replace('SOUND_ARWEAVE_LINK', "https://arweave.net/" + arweave_sound)

			if player == "superformula":
				ranNum = str(int(round(quantumrandom.randint(0,5))) * 2)
				player += f"-{ranNum}"
				sketch = sketch.replace("SUPERFORMULA_M", ranNum)

			if modeNum % 2 == 0: 
			#[0,2,4,6]:
				player += "-dark"
				sketch = sketch.replace("RGB_BACKGROUND_COLOR", "26,32,44")
				sketch = sketch.replace("RGB_FILL_COLOR", "255,245,245")
			else: 
			#[7,1,3,5]
				player += "-light"
				sketch = sketch.replace("RGB_BACKGROUND_COLOR", "255,245,245")
				sketch = sketch.replace("RGB_FILL_COLOR", "26,32,44")

		return sketch, player

	def choose_player(self):
		glitch_nums = [0,5,10]
		colors_nums = [1,4,9,13]
		randomdancers_nums = [2,6,11,14]
		#superformula_nums = [3,7,8,12]

		num = int(round(quantumrandom.randint(0,14)))

		if num in glitch_nums:
			playersketch = self.glitch_template_sketch
			player = "glitch"

		elif num in colors_nums:
			playersketch = self.color_template_sketch
			player = "colors"

		elif num in randomdancers_nums:
			playersketch = self.randomdancers_template_sketch
			player = "randomdancers"
		else:
			playersketch = self.superformula_template_sketch
			player = "superformula"

		return playersketch, player


	def create_nft_website(self, metadata: Metadata):
		webdir = os.path.join(self.websites_folder, metadata.id)
		soundsstring = ""
		first = True
		for sp in metadata.sounds:
			if(not first):
				soundsstring += ", "
			else:
				first = False
			soundsstring += sp.filename.replace(self.base_sounds_folder, "").replace(".flac", "")

		if not os.path.exists(webdir):
			os.makedirs(webdir)

		sketch, player = self.build_sketch(metadata.arweave_id_sound)

		with open(self.template_html) as f:
			htmlfile=f.read().replace('RARITY_COLOR', metadata.rarity)
			htmlfile=htmlfile.replace('TOKEN_NAME', metadata.token_name)
			htmlfile=htmlfile.replace('SOUND_PROBABILITY', str(metadata.probability))
			htmlfile=htmlfile.replace('USED_SOUNDS', soundsstring)
			htmlfile=htmlfile.replace('BUYING_TX', metadata.id)
			htmlfile=htmlfile.replace('PLAYER', player)
			if('-light' in player):
				htmlfile=htmlfile.replace('BACKGROUND_COLOR', "255,245,245")
				htmlfile=htmlfile.replace('TEXT_COLOR', "26,32,44")
				metadata.image = self.light_image
			else:
				htmlfile=htmlfile.replace('BACKGROUND_COLOR', "26,32,44")
				htmlfile=htmlfile.replace('TEXT_COLOR', "255,245,245")
				metadata.image = self.dark_image

		htmlfilename = os.path.join(webdir, "index.html")
		with open(htmlfilename, "w") as f:
			f.write(htmlfile)

		metadata.player = player

		sketchfilename = os.path.join(webdir, "sketch.js")
		with open(sketchfilename, "w") as f:
			f.write(sketch)

		return metadata


		




