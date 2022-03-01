import os
from app.models.metadata import Metadata
import quantumrandom

class Websites:
	# sounds_folder = "/home/azureuser/cswaves"
	websites_folder = "/home/azureuser/websites"
	base_sounds_folder = "/home/azureuser/cswaves"
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
		print("making website")
		print("webdir")
		print(webdir)
		soundsstring = ""
		first = True
		for sp in metadata.sounds:
			if(not first):
				soundsstring += ", "
			else:
				first = False
			soundsstring += sp.filename.replace(self.base_sounds_folder, "").replace(".flac", "")
		print(soundsstring)
		if not os.path.exists(webdir):
			os.makedirs(webdir)

		sketch, player = self.build_sketch(metadata.arweave_id_sound)
		print("sketch")
		print(sketch)
		print("player")
		print(player)

		with open(self.template_html) as f:
			htmlfile=f.read().replace('RARITY_COLOR', metadata.rarity)
			htmlfile=htmlfile.replace('TOKEN_NAME', str(metadata.token_name))
			htmlfile=htmlfile.replace('SOUND_PROBABILITY', str(metadata.probability))
			htmlfile=htmlfile.replace('USED_SOUNDS', soundsstring)
			htmlfile=htmlfile.replace('BUYING_TX', metadata.id)
			htmlfile=htmlfile.replace('PLAYER', player)
			if('-light' in player):
				htmlfile=htmlfile.replace('BACKGROUND_COLOR', "255,245,245")
				htmlfile=htmlfile.replace('TEXT_COLOR', "26,32,44")
				# metadata.image = self.light_image
			else:
				htmlfile=htmlfile.replace('BACKGROUND_COLOR', "26,32,44")
				htmlfile=htmlfile.replace('TEXT_COLOR', "255,245,245")
				# metadata.image = self.dark_image
		
		metadata.image = self.imageForPlayer(player)

		htmlfilename = os.path.join(webdir, "index.html")
		with open(htmlfilename, "w") as f:
			f.write(htmlfile)

		metadata.player = player

		sketchfilename = os.path.join(webdir, "sketch.js")
		with open(sketchfilename, "w") as f:
			f.write(sketch)

		return metadata


	def imageForPlayer(self, player):
		imagesDict = {
			'colors-dark' : 'QmU8BsKhrb7r8E3M2sxAYLQzKvFbei48isxKbTSDZcr7LC',
			'colors-light' : 'QmZ6UehJDMEJqYtVDYfPScGdEymAZmfVrrMivoxEVo2GAC',
			'glitch-dark' : 'QmSwTCA9gUhs6kjfNdiF4fzFFWLTQ1bSdpMDBwm3rQrJTF',
			'glitch-light' : 'QmWyevXCZXhsqqgZP1j3CukoTSwsXpeRAtEXFCkWkxhfaG',
			'randomdancers-dark' : 'QmQXF2bLQ2H5yZ87xiG3JSwpxm57dYBVVTVyWcD4Hq1WZX',
			'randomdancers-light' : 'QmXnot5JhVqWFKweTRJgQg42b3KTEfH1czARi3gNzpmV1w',
			'superformula-0-light' : 'QmdrQtaqpCGArAZw9oK1SJXt2BY1vwJohtCMeoQks8N5xA',
			'superformula-0-dark' : 'QmcG5g44D6LzUsVSFsyqD5QzkCmLidthPoo1AV6kkWiTYF',
			'superformula-2-light' : 'QmfXy3WrdMfTpx7ZVMjwAfVwfzodhyETz7hyoimRE1pcYR',
			'superformula-2-dark' : 'QmQRsgeD2YCrScMqJmPtYhuTUGxDsXFx32wLekz4tmsjJK',
			'superformula-4-light' : 'QmdKBFmAYHb1Y2WJhGLxNCa9qTwwQK4jYxvhv2q57YDwWf',
			'superformula-4-dark' : 'QmS6WHneZZUzw36gCSjxtqHtVNx499Cz7NBP62fyoeyC2T',
			'superformula-6-light' : 'QmcMUTjrPA4U48EBubuqmjKW5TQzxX8XuhvsqnsnbqgRyg',
			'superformula-6-dark' : 'QmNxoC1cYSidFDHHfrcAkGFLadKj8arf6PKjG8SZvGmqNY',
			'superformula-8-light' : 'QmbJ3ZPiik15kagxmSZR5feoKMziZTDT9fqnBdLUkKyMoo',
			'superformula-8-dark' : 'QmdVKmB9w1LzagsNtZHaGnbx8hfbAU6qwb69tpQiU4AiCV',
			'superformula-10-light' : 'Qmdu6BotLjJuMmGQiB6rHWnG7JEH4v8wpbM18j1Wf5fCKb',
			'superformula-10-dark' : 'QmfFptHUEpVhZFFSyWHT3egDA8rv4E4XHC8yHLcJG9h1vD'
		}
		return imagesDict[player]
		




