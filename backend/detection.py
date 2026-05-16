from ultralytics import YOLO
import cv2

# Load YOLO model
model = YOLO("yolov8n.pt")

def detect_vehicles(frame):

    results = model(frame)

    vehicle_count = 0

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])
            name = model.names[cls]

            # Count only vehicles
            if name in ["car", "truck", "bus", "motorcycle"]:
                vehicle_count += 1

    return vehicle_count