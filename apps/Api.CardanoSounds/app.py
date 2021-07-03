from flask import Flask, render_template, request, redirect, jsonify, url_for, flash
from rq import Queue
from rq.job import Job
from worker import conn
from sounds import Sounds

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
    upload




@app.route("/")
def index():
    return "index"


@app.route("/sound")
def generate_sound(tx: Transaction):
    #from app import
    
    q.enqueue_call(
            func=start_sound_generation, args=(tx,), result_ttl=5000
        )




if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8000)
