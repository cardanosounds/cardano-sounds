import os
import glob
import pickle
import qrandom
from app.mixsound import MixSound
from app.models.soundprobability import SoundProbability
from app.models.metadata import Metadata
from app.models.transaction import Transaction

class Sounds:

	enrich_probab_file = "/home/azureuser/cardano-sounds/apps/enriching-sound-probability.data"
	base_sounds_folder = "/home/azureuser/soundclips/cswaves"
	common_color = "#22543D" #green
	mid_rare_color = "#2A4365" #blue
	rare_color = "#000" #basic black

	def get_enrich_sound(self):
		sps = self.enrich_sounds_probabilities()
		num = qrandom.randint(0, 100000)
		probrange = 0
		previous_sound: SoundProbability = sps[0]
		for sp in sps:
			probrange += sp.probability * 100000
			if probrange > num: 
				return previous_sound
			else:
				previous_sound = sp
		return previous_sound

	def enrich_sounds_probabilities(self):
		filehandler = open(self.enrich_probab_file, 'rb') 
		return pickle.load(filehandler)

	def calc_enrich_sounds_probabilities(self):

		last_prob = 0
		
		filePaths = glob.glob(os.path.join(self.base_sounds_folder,"enriching-rarest/*"))
		i = 1
		sps = []
		for fp in filePaths:
			prob = i * 0.001
			prob = round(prob, 5)
			category = "enriching-rare"

			sp = SoundProbability(probability=prob, filename=fp, category=category)
			sps.append(sp)
			last_prob = sp.probability
			i += 0.37

		filePaths = glob.glob(os.path.join(self.base_sounds_folder,"enriching-mid-rare/*"))
		i = 1
		for fp in filePaths:
			prob = i * 0.001 + last_prob
			prob = round(prob, 5)
			category = "enriching-mid"

			sp = SoundProbability(probability=prob, filename=fp, category=category)
			sps.append(sp)
			last_prob = sp.probability
			i += 0.002


		filePaths = glob.glob(os.path.join(self.base_sounds_folder, "enriching-common/*"))
		i = 1
		for fp in filePaths:
			prob = i * 0.00003 + last_prob
			prob = round(prob, 5)
			category = "enriching-common"
			sp = SoundProbability(probability=prob, filename=fp, category=category)
			sps.append(sp)
			i += 0.94	
			
		fw = open(self.enrich_probab_file, 'wb')

		pickle.dump(sps, fw)
		print(sps)
		fw.close()


	def get_melody(self):
		return self.get_sound(os.path.join(self.base_sounds_folder, "melodies/"), category="melody")

	def get_bass(self):
		return self.get_sound(os.path.join(self.base_sounds_folder, "bass/"), category="bass")

	def get_drums(self):
		return self.get_sound(os.path.join(self.base_sounds_folder, "drums/"), category="drums")

	def get_signature(self):
		return self.get_sound(os.path.join(self.base_sounds_folder, "signatures/"), category="signature")

	def get_random_track(self, tx: Transaction):
		mix = MixSound()

		enrich = self.get_enrich_sound()
		melody = self.get_melody()
		drums = self.get_drums()
		bass = self.get_bass()
		signature = self.get_signature()

		total_probability = enrich.probability * melody.probability * drums.probability * bass.probability * signature.probability * 100

		if(enrich.category == "enriching-common"):
			rarity = self.common_color
		elif(enrich.category == "enriching-mid"):
			rarity = self.mid_rare_color
		else:
			rarity = self.rare_color

		mix.mix_sound(
			tx.Tx_Hash,
			enrich,
			melody,
			drums,
			bass,
			signature
		)

		return Metadata(tx.Tx_Hash, tx.id, total_probability, rarity, [enrich, melody, drums, bass, signature])


	def get_sound(self, folder_path, category):
		filePaths = glob.glob(folder_path + "*")
		melodies_count = len(filePaths)
		random_num = qrandom.randint(1, melodies_count)
		return SoundProbability(probability=round(1/melodies_count, 5), filename=filePaths[random_num - 1], category=category)

