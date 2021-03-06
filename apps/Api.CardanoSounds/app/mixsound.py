import os
from pydub import AudioSegment
from app.models.soundprobability import SoundProbability

AudioSegment.converter = "/usr/bin/ffmpeg"

class MixSound:
	#1 enriching sounds
	#2 melody
	#3 bass
	#4 drums
	#5 signature
	output_folder = "/home/azureuser/sounds"

	def mix_sound(self, Tx_Hash, enriching: SoundProbability, melody: SoundProbability, drums: SoundProbability, bass: SoundProbability, signature: SoundProbability):
		print(enriching.filename)
		sound1 = AudioSegment.from_file(enriching.filename, format="flac")
		sound2 = AudioSegment.from_file(melody.filename, format="flac")
		sound3 = AudioSegment.from_file(drums.filename, format="flac")
		sound4 = AudioSegment.from_file(bass.filename, format="flac")
		sound5 = AudioSegment.from_file(signature.filename, format="flac")

		#overlay them over each other
		output = sound1.overlay(sound2)
		output = output.overlay(sound3)
		output = output.overlay(sound4)
		output = output.overlay(sound5)
		out_file = os.path.join(self.output_folder, Tx_Hash + ".mp3")
		
		output.export(out_file, format="mp3")
