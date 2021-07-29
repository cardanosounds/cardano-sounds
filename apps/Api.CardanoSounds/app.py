from flask import Flask, render_template, request, redirect, jsonify, url_for, flash
from rq import Queue
from rq.job import Job
from worker import conn
from sounds import Sounds
from upload import Upload
from websites import Websites
from arweavedeploy import ArweaveDeploy
from db.query import Query
import jsons

import random
import string
import logging
import json
import httplib2
import requests
from models.transaction import Transaction
from models.tokenvalue import TokenValue


app = Flask(__name__)

q = Queue(connection=conn)


def start_sound_generation(tx: Transaction):
    sounds = Sounds()
    metadata = sounds.get_random_track(tx)
    upload = Upload()
    metadata.ipfs_id_sound = upload.upload_to_ipfs(tx.tx_hash)
    metadata.arweave_id_sound = upload.upload_to_arweave(tx.tx_hash)
    websites = Websites()
    metadata = websites.create_nft_website(metadata)
    deploy = ArweaveDeploy()
    print(deploy.deploy_website(tx.tx_hash))
    query = Query()
    query.insert_metadata(metadata)



@app.route("/")
def index():
    return "index"


@app.route("/addtxtoqueue", methods=['POST'])
def generate_sound():
    from app import start_sound_generation

    tx = jsons.load(request.json, Transaction)
    
    q.enqueue_call(
            func=start_sound_generation, args=(tx,), result_ttl=5000
        )




if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8000)
