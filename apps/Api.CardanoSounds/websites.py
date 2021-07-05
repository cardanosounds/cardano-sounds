import os
from models.metadata import Metadata

class Websites:
	sounds_folder = "/home/dzcodes/sounds"
	websites_folder = "/home/dzcodes/websites"
	base_sounds_folder = "/home/dzcodes/cs-base-sounds/"
	template_html = "/home/dzcodes/nft-web-templates/index.html"
	template_sketch = "/home/dzcodes/nft-web-templates/sketch.js"
	common_color = "#22543D" #green
	mid_rare_color = "#2A4365" #blue
	rare_color = "#000" #basic black
	common = "common"
	rare = "rare"


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

		with open(self.template_html) as f:
			if(metadata.rarity == 1):
				color = self.common_color
			elif(metadata.rarity == 2):
				color = self.mid_rare_color
			else:
				color = self.rare_color
			htmlfile=f.read().replace('RARITY_COLOR', color)
			htmlfile=htmlfile.replace('TOKEN_NAME', metadata.token_name)
			htmlfile=htmlfile.replace('SOUND_PROBABILITY', str(metadata.probabilty))
			htmlfile=htmlfile.replace('USED_SOUNDS', soundsstring)
			htmlfile=htmlfile.replace('BUYING_TX', metadata.id)

		htmlfilename = os.path.join(webdir, "index.html")
		with open(htmlfilename, "w") as f:
			f.write(htmlfile)


		with open(self.template_sketch) as f:
			sketch=f.read().replace('SOUND_ARWEAVE_LINK', "https://arweave.net/" + metadata.arweave_id_sound)

		sketchfilename = os.path.join(webdir, "sketch.js")
		with open(sketchfilename, "w") as f:
			f.write(sketch)


		




