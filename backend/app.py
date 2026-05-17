from flask import Flask, jsonify, Response
from flask_cors import CORS
from detection import detect_vehicles
import cv2

app = Flask(__name__)
CORS(app)

# API Route
@app.route("/traffic")
def traffic():

    vehicle_count, frame = detect_vehicles()

    return jsonify({
        "vehicles": vehicle_count
    })

# Video Feed Route
@app.route("/video")
def video():

    def generate():

        while True:

            vehicle_count, frame = detect_vehicles()

            ret, buffer = cv2.imencode('.jpg', frame)

            frame_bytes = buffer.tobytes()

            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' +
                frame_bytes +
                b'\r\n'
            )

    return Response(
        generate(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

# Home Route
@app.route("/")
def home():

    return jsonify({
        "message": "Smart Traffic AI Backend Running"
    })

if __name__ == "__main__":
    app.run(debug=True)