from pydub import AudioSegment
from models.transaction import Transaction
#1 enriching sounds
#2 melody
#3 bass
#4 drums
#5 signature
#paths to sound files we are merging
f1 = "F:/CSwaves/w1_3_18.flac" #
f2 = "F:/CSwaves/w2_21.flac"
f3 = "F:/CSwaves/w3_9.flac"
f4 = "F:/CSwaves/w4_14.flac"
f5 = "F:/CSwaves/w5_10.flac"

fE = "F:/CSwaves/music.mp3"

sound1 = AudioSegment.from_file(f1, format="flac")
sound2 = AudioSegment.from_file(f2, format="flac")
sound3 = AudioSegment.from_file(f3, format="flac")
sound4 = AudioSegment.from_file(f4, format="flac")
sound5 = AudioSegment.from_file(f5, format="flac")

#overlay them over each other
output = sound1.overlay(sound2)
output = output.overlay(sound3)
output = output.overlay(sound4)
output = output.overlay(sound5)

#fadeout at the end 2 sec
#output = output.fade_out(2000)

output.export(fE, format="mp3")




#def mix_sound(tx: Transaction):
