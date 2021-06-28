from flask import Flask, render_template, request, redirect, jsonify, url_for, flash


import random
import string
import logging
import json
import httplib2
import requests
from models.transaction import Transaction
from models.tokenvalue import TokenValue


app = Flask(__name__)


@app.route("/")
def index():
    return "index"



if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=8000)
