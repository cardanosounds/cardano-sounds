import glob
import pickle
from random import randrange
from models.soundprobability import SoundProbability

class AudioFiles:

	enrich_probab_file = "enriching-sound-probability.data"

	def get_enrich_sound(self):
		sps = self.enrich_sounds_probabilities()
		num = randrange(100000)
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
		
		

auo = AudioFiles()
print(auo.get_enrich_sound())			



