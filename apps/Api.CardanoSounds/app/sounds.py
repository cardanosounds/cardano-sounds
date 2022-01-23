import os
import glob
import pickle
import quantumrandom
from app.mixsound import MixSound
from app.models.soundprobability import SoundProbability
from app.models.metadata import Metadata
from app.models.transaction import Transaction
import numpy as np

def format_float(num):
    return np.format_float_positional(num, trim='-')

class Sounds:

	enrich_probab_file = "/home/azureuser/enriching-sound-probability.data"
	base_sounds_folder = "/home/azureuser/cswaves"
	common_color = "#22543D" #green
	mid_rare_color = "#2A4365" #blue
	rare_color = "#000" #basic black

	def get_enrich_sound(self):
		sps = self.enrich_sounds_probabilities()
		num = int(round(quantumrandom.randint(0, 100000)))
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
	# def get_random_track(self, tx_hash):
		mix = MixSound()

		enrich = self.get_enrich_sound()
		melody = self.get_melody()
		drums = self.get_drums()
		bass = self.get_bass()
		signature = self.get_signature()

		total_probability = enrich.probability * melody.probability * drums.probability * bass.probability * signature.probability * 100
		total_probability = format_float(total_probability)

		enrich.probability = format_float(enrich.probability)
		melody.probability = format_float(melody.probability)
		drums.probability = format_float(drums.probability)
		bass.probability = format_float(bass.probability)
		signature.probability = format_float(signature.probability)

		if(enrich.category == "enriching-common"):
			rarity = self.common_color
		elif(enrich.category == "enriching-mid"):
			rarity = self.mid_rare_color
		else:
			rarity = self.rare_color

		mix.mix_sound(
			tx.tx_hash,
			# tx_hash,
			enrich,
			melody,
			drums,
			bass,
			signature
		)
		ext = '.flac'
		enrich.filename = enrich.filename.replace("/home/azureuser/cswaves/enriching-common/", "enriching:").replace("/home/azureuser/cswaves/enriching-rarest/", "enriching: ").replace("/home/azureuser/cswaves/enriching-mid-rare/", "enriching: ").replace(ext, "")
		melody.filename = melody.filename.replace("/home/azureuser/cswaves/melodies/", "melody: ").replace(ext, "")
		drums.filename = drums.filename.replace("/home/azureuser/cswaves/drums/", "drums: ").replace(ext, "")
		bass.filename = bass.filename.replace("/home/azureuser/cswaves/bass/", "bass: ").replace(ext, "")
		signature.filename = signature.filename.replace("/home/azureuser/cswaves/signatures/", "signatures: ").replace(ext, "")
		# return rarity	
		return Metadata(tx.tx_hash, tx.id, total_probability, rarity, [enrich, melody, drums, bass, signature])


	def get_sound(self, folder_path, category):
		filePaths = glob.glob(folder_path + "*")
		melodies_count = len(filePaths)
		random_num = int(round(quantumrandom.randint(1, melodies_count)))
		return SoundProbability(probability=round(1/melodies_count, 5), filename=filePaths[int(random_num - 1)], category=category)

# sounds = Sounds()
# print(sounds.get_random_track("txhash2454654684565464654"))