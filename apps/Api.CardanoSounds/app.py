import sys
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
    try:                
#         get request json object
        request_json = request.get_json()      
#         convert to response json object 
        response = jsonify(request_json)
        tx = jsons.load(request_json, Transaction)
        
        q.enqueue_call(
                func=start_sound_generation, args=(tx,), result_ttl=5000
            )
        response.status_code = 200  
    except:
        exception_message = sys.exc_info()[1]
        response = json.dumps({"content":exception_message})
        response.status_code = 400
    return(response)
    #print(request.json)


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8000)
