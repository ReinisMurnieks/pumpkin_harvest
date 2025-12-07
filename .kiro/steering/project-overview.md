# City Building Simulator - Project Overview

## Project Description
A realistic city-building simulation game for children aged 6-8 to learn about urban planning, logistics, and city management through interactive gameplay.

## Technology Stack
- **Backend**: Python 3.8+ with Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Graphics**: HTML5 Canvas for rendering

## Project Structure
```
├── app.py                 # Flask server and game logic
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css     # Game styling
│   └── js/
│       └── game.js       # Game logic and rendering
├── templates/
│   ├── index.html        # Welcome page
│   └── game.html         # Main game interface
└── README.md             # Documentation
```

## Key Features
1. **Realistic City Simulation**
   - Power and water systems
   - Employment and economy
   - Pollution and crime management
   - Traffic simulation

2. **Day/Night Cycle**
   - Dynamic sky colors
   - Building lights at night
   - Animated stars and celestial bodies

3. **13 Building Types**
   - Residential (houses, apartments)
   - Commercial (offices)
   - Industrial (factories)
   - Infrastructure (power, water, roads, metro)
   - Services (hospitals, schools, police)
   - Recreation (parks, stadiums)

4. **Metro System**
   - Automated trains
   - Passenger simulation
   - Route management

## Development Guidelines
- Keep code simple and readable for educational purposes
- Use emojis for building icons (kid-friendly)
- Maintain 60 FPS animation
- Balance realism with simplicity for target age group

## Running the Project
```bash
pip install -r requirements.txt
python app.py
```
Visit: http://localhost:5000
