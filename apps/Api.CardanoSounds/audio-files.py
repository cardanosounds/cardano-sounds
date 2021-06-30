import glob
import pickle
from models.soundprobability import SoundProbability

class AudioFiles:

	def calc_enrich_sounds_probabilities():
		data_file = "enriching-sound-probability.data"

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
			fw = open(data_file, 'wb')

		pickle.dump(sps, fw)
		fw.close()
		
		filehandler = open(data_file, 'rb') 
		sps = pickle.load(filehandler)

		sum = 0
		for sp in sps:
			sum += sp.probability
			print(sp)

		print(sum)	



