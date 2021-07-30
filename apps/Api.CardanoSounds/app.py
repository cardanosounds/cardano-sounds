from flask import Flask, render_template, request, redirect, jsonify, url_for, flash
from rq import Queue
from rq.job import Job
from rq.decorators import job
from worker import conn
import jsons

import random
import string
import logging
import json
import httplib2
import requests
from app.models.transaction import Transaction
from app.models.tokenvalue import TokenValue


app = Flask(__name__)

q = Queue(connection=conn)


@app.route("/")
def index():
    from jobs import add
    q.enqueue_call(
            func=add, args=(), result_ttl=5000
        )
    return "queued"


@app.route("/addtxtoqueue", methods=['POST'])
def generate_sound():
    from jobs import start_sound_generation

    tx = jsons.load(request.json, Transaction)
    
    q.enqueue_call(
            func=start_sound_generation, args=(tx,), result_ttl=5000
        )


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8000)
