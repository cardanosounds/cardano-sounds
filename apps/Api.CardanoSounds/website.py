import os
class Website:
	websites_folder = "F:\CSwaves\generated-websites\\"
	template_html = "F:\CSwaves\glitch-web-template\index.html"
	template_sketch = "F:\CSwaves\glitch-web-template\sketch.js"
	common_color = "#22543D" #green
	mid_rare_color = "#2A4365" #blue
	rare_color = "#000" #basic black
	common = "common"
	rare = "rare"


	def create_nft_website(self, tx_hash, token_name, arweave_link, rarity, probability, sounds):
		webdir = os.path.join(self.websites_folder, tx_hash)
		if not os.path.exists(webdir):
			os.makedirs(webdir)

		with open(self.template_html) as f:
			if(rarity == 1):
				color = self.common_color
			elif(rarity == 2):
				color = self.mid_rare_color
			else:
				color = self.rare_color
			htmlfile=f.read().replace('RARITY_COLOR', color)
			htmlfile=htmlfile.replace('TOKEN_NAME', token_name)
			htmlfile=htmlfile.replace('SOUND_PROBABILITY', probability)
			htmlfile=htmlfile.replace('USED_SOUNDS', sounds)
			htmlfile=htmlfile.replace('BUYING_TX', tx_hash)

		htmlfilename = os.path.join(webdir, "index.html")
		with open(htmlfilename, "w") as f:
			f.write(htmlfile)


		with open(self.template_sketch) as f:
			sketch=f.read().replace('SOUND_ARWEAVE_LINK', arweave_link)

		sketchfilename = os.path.join(webdir, "sketch.js")
		with open(sketchfilename, "w") as f:
			f.write(sketch)


		




