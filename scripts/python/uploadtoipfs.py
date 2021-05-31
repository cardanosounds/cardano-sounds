import os
import requests

def uploadToIPFS(filePath):

    PROJECT_ID = os.getenv('PROJECT_ID')

    headers = {
        'project_id': f"{PROJECT_ID}",
    }

    files = {
        'file': (filePath, open(filePath, 'rb')),
    }

    response = requests.post('https://ipfs.blockfrost.io/api/v0/ipfs/add', headers=headers, files=files)



