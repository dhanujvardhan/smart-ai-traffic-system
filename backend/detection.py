from ultralytics import YOLO
import cv2

# Load YOLO Model
model = YOLO("yolov8n.pt")

# Open Traffic Video
cap = cv2.VideoCapture("traffic.mp4")

def detect_vehicles():

    success, frame = cap.read()

    # Restart video when finished
    if not success:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        success, frame = cap.read()

    results = model(frame)

    vehicle_count = 0

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])
            name = model.names[cls]

            # Count vehicles only
            if name in ["car", "truck", "bus", "motorcycle"]:
                vehicle_count += 1

                # Draw rectangle
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
                    0.5,
                    (0, 255, 0),
                    2
                )

    return vehicle_count, frame