from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():

    return jsonify({
        "message": "AI Traffic Backend Running"
    })

@app.route("/traffic")
def traffic():

    vehicle_count = random.randint(1, 20)

    return jsonify({
        "vehicles": vehicle_count
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)