import sys, base64

downloaded_binary_data_path = 'F:/iZATnpfbYAPy5s6dIKIkKw-PqV3xK0lhU_mlFyugd3w'

f = open(downloaded_binary_data_path, 'rb')
b = base64.b64decode(f.read())
f.close()

file = open(downloaded_binary_data_path + '.mp3', 'wb')
file.write(b)
file.close()
