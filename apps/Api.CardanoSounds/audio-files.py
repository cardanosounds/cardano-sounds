import glob
from models.soundprobability import SoundProbability

class AudioFiles:
	data_file = "sound_probability.data"

	
	filePaths = glob.glob("/raresounds/*")
	i = 1
	sps = []
	for fp in filePaths:
		sp = SoundProbability()
		sp.filename = fp
		sp.probability = i * 0.001
		sp.category = "enriching"
		sps.append(sp)






	fw = open(outputFile, 'wb')
	pickle.dump(dataset, fw)
	fw.close()