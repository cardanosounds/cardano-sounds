from pydub import AudioSegment

#paths to sound files we are merging
f1 = "Path/file.flac"
f2 = "Path/file.flac"
f3 = "Path/file.flac"
f4 = "Path/file.flac"
f5 = "Path/file.flac"

fE = "FileExport"

sound1 = AudioSegment.from_file(f1, format="flac")
sound2 = AudioSegment.from_file(f2, format="flac")
sound3 = AudioSegment.from_file(f3, format="flac")
sound4 = AudioSegment.from_file(f4, format="flac")
sound5 = AudioSegment.from_file(f5, format="flac")

#overlay them over each other
output = sound1.overlay(sound2).overlay(sound3).overlay(sound4).overlay(sound5)

#fadeout at the end 2 sec
output = output.fade_out(2000)

output.export(fE, format="flac")




