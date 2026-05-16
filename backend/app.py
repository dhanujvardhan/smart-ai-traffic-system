from flask import Flask, Response, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2

app = Flask(__name__)
CORS(app)

# Load YOLO model
model = YOLO("yolov8n.pt")

camera = cv2.VideoCapture(0)

def generate_frames():

    while True:

        success, frame = camera.read()

        if not success:
            break

        results = model(frame)

        vehicle_count = 0

        for r in results:

            boxes = r.boxes

            for box in boxes:

                cls = int(box.cls[0])
                name = model.names[cls]

                if name in ["car", "truck", "bus", "motorcycle"]:

                    vehicle_count += 1

                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    cv2.rectangle(
                        frame,
                        (x1, y1),
                        (x2, y2),
                        (0, 255, 0),
                        2
                    )

                    cv2.putText(
                        frame,
                        name,
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        (0, 255, 0),
                        2
                    )

        cv2.putText(
            frame,
            f"Vehicles: {vehicle_count}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            3
        )

        ret, buffer = cv2.imencode('.jpg', frame)

        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' +
               frame + b'\r\n')

@app.route("/")
def home():
    return {"message": "AI Traffic Backend Running"}

@app.route("/video")
def video():
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route("/traffic")
def traffic():

    success, frame = camera.read()

    if not success:
        return jsonify({"vehicles": 0})

    results = model(frame)

    vehicle_count = 0

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])
            name = model.names[cls]

            if name in ["car", "truck", "bus", "motorcycle"]:
                vehicle_count += 1

    return jsonify({
        "vehicles": vehicle_count
    })

if __name__ == "__main__":
    app.run(debug=True)