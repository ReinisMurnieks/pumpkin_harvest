from flask import Flask, render_template, jsonify, request
import random
import time

app = Flask(__name__)

# Metro system data
METRO_LINES = [
    {
        "id": "red",
        "name": "Red Line",
        "color": "#E74C3C",
        "stations": ["downtown", "university", "airport", "downtown"],
        "trainCount": 2
    },
    {
        "id": "blue",
        "name": "Blue Line",
        "color": "#3498DB",
        "stations": ["downtown", "shopping", "stadium", "downtown"],
        "trainCount": 2
    },
    {
        "id": "green",
        "name": "Green Line",
        "color": "#2ECC71",
        "stations": ["university", "shopping", "hospital", "park", "university"],
        "trainCount": 2
    }
]

STATIONS = [
    {"id": "downtown", "name": "Downtown Central", "emoji": "🏢", "x": 450, "y": 300, "passengers": 0},
    {"id": "university", "name": "University", "emoji": "🎓", "x": 200, "y": 200, "passengers": 0},
    {"id": "airport", "name": "Airport", "emoji": "✈️", "x": 200, "y": 450, "passengers": 0},
    {"id": "shopping", "name": "Shopping Mall", "emoji": "🛍️", "x": 700, "y": 200, "passengers": 0},
    {"id": "stadium", "name": "Stadium", "emoji": "🏟️", "x": 700, "y": 450, "passengers": 0},
    {"id": "hospital", "name": "Hospital", "emoji": "🏥", "x": 550, "y": 100, "passengers": 0},
    {"id": "park", "name": "Central Park", "emoji": "🌳", "x": 650, "y": 350, "passengers": 0}
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/api/passenger-pickup', methods=['POST'])
def passenger_pickup():
    data = request.json
    station_id = data.get('station_id')
    passengers = data.get('passengers', 0)
    
    return jsonify({"success": True, "points": passengers * 2})

@app.route('/api/get-stations', methods=['GET'])
def get_stations():
    return jsonify({"stations": STATIONS, "metro_lines": METRO_LINES})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
