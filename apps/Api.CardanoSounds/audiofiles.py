import glob
import pickle
import qrandom
from mixsound import MixSound
from models.soundprobability import SoundProbability

class AudioFiles:

	enrich_probab_file = "enriching-sound-probability.data"

	def get_enrich_sound(self):
		sps = self.enrich_sounds_probabilities()
		num = qrandom.randint(0, 100000)
		probrange = 0
		previous_sound = sps[0]
		for sp in sps:
			probrange += sp.probability * 100000
			if probrange > num: 
				return previous_sound
			else:
				previous_sound = sp
		return

	def enrich_sounds_probabilities(self):
		filehandler = open(self.enrich_probab_file, 'rb') 
		return pickle.load(filehandler)

	def calc_enrich_sounds_probabilities(self):

		last_prob = 0
		
		filePaths = glob.glob("F:/CSwaves/enriching-rarest/*")
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

		filePaths = glob.glob("F:/CSwaves/enriching-mid-rare/*")
		i = 1
		for fp in filePaths:
			prob = i * 0.001 + last_prob
			prob = round(prob, 5)
			category = "enriching-mid"

			sp = SoundProbability(probability=prob, filename=fp, category=category)
			sps.append(sp)
			last_prob = sp.probability
			i += 0.002


		filePaths = glob.glob("F:/CSwaves/enriching-common/*")
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
		fw.close()


	def get_melody(self):
		return self.get_sound("F:/CSwaves/melodies/", "melody")

	def get_bass(self):
		return self.get_sound("F:/CSwaves/bass/", "bass")

	def get_drums(self):
		return self.get_sound("F:/CSwaves/drums/", "drums")

	def get_signature(self):
		return self.get_sound("F:/CSwaves/signatures/", "signature")

	def get_random_track(self, tx_hash):
		mix = MixSound()
		mix.mix_sound(
			tx_hash,
			self.get_enrich_sound(),
			self.get_melody(),
			self.get_drums(),
			self.get_bass(),
			self.get_signature()
		)

	def get_sound(self, folder_path, category):
		filePaths = glob.glob(folder_path + "*")
		melodies_count = len(filePaths)
		random_num = qrandom.randint(1, melodies_count)
		return SoundProbability(probability=round(1/melodies_count, 5), filename=filePaths[random_num - 1], category=category)

		
auo = AudioFiles()
mixer = MixSound()

sps = auo.get_random_track("randomTxHash000000111122222333344445555666677777888889999")


	

