import sys, base64
from arweave.arweave_lib import Wallet, Transaction
from arweave.transaction_uploader import get_uploader

f_n1 = 'sound_file'
f_n2 = 'folder'

wk_file = 'key_file'


f = open(f_n1, 'rb')
b = base64.b64encode(f.read())
print(len(b))
f.close()

file = open(f_n2 + '.txt', 'wb')
file.write(b)
file.close()


f = open(f_n2 + '.txt', 'rb')
b = base64.b64decode(f.read())
f.close()

file = open(f_n2 + '2.mp3', 'wb')
file.write(b)
file.close()


wallet = Wallet(wk_file)

with open(f_n2 + '.txt', 'rb') as bin_data_file:
    bin_data = bin_data_file.read()
    
    transaction = Transaction(wallet, data=bin_data)
    transaction.sign()
    transaction.send()