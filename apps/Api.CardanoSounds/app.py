from flask import Flask, render_template, request, redirect, jsonify, url_for, flash
from rq import Queue
from rq.job import Job
from worker import conn

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

@app.route("/")
def index():
    return "index"


@app.route("/sound")
def generate_sound(tx: Transaction):
    #from app import
    job = q.enqueue_call(
            func=start_generating, args=(tx,), result_ttl=5000
        )




if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8000)
