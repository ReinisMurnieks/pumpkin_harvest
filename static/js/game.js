// City state
let population = 0;
let budget = 50000;
let happiness = 50;
let isPaused = false;

// Advanced city metrics
let powerSupply = 0;
let powerDemand = 0;
let waterSupply = 0;
let waterDemand = 0;
let pollution = 0;
let crime = 0;
let traffic = 0;
let employment = 0;
let unemployed = 0;
let taxRate = 0.10; // 10% tax rate
let monthlyIncome = 0;
let monthlyExpenses = 0;

// Day/night cycle
let timeOfDay = 8; // 0-24 hours (start at 8 AM)
let daySpeed = 0.05; // Hours per frame
let isNight = false;

// Disasters
let activeDisaster = null;
let disasterCooldown = 0;

// Achievements
let achievements = {
    firstBuilding: false,
    population100: false,
    population500: false,
    population1000: false,
    millionaire: false,
    happyCity: false,
    greenCity: false,
    safeCitizen: false,
    megaCity: false
};

// Statistics history for charts
let statsHistory = {
    population: [],
    budget: [],
    happiness: [],
    pollution: []
};

// Canvas
const canvas = document.getElementById('track-canvas');
const ctx = canvas.getContext('2d');

// City grid
const GRID_SIZE = 50;
const GRID_COLS = Math.floor(canvas.width / GRID_SIZE);
const GRID_ROWS = Math.floor(canvas.height / GRID_SIZE);

// City buildings and structures
let cityGrid = [];
let metroStations = [];
let metroLines = [];
let trains = [];
let trainIdCounter = 0;

// Current tool
let selectedTool = null;
let selectedToolCost = 0;

// Building types with realistic properties
const BUILDINGS = {
    residential: { 
        emoji: '🏠', color: '#FFD700', population: 15, cost: 1000,
        powerDemand: 2, waterDemand: 2, jobs: 0, pollution: 1, traffic: 2
    },
    apartment: { 
        emoji: '🏘️', color: '#F4D03F', population: 40, cost: 3000,
        powerDemand: 5, waterDemand: 5, jobs: 0, pollution: 2, traffic: 5
    },
    commercial: { 
        emoji: '🏢', color: '#3498DB', population: 0, cost: 2500,
        powerDemand: 4, waterDemand: 2, jobs: 20, pollution: 2, traffic: 8, income: 500
    },
    industrial: { 
        emoji: '🏭', color: '#95A5A6', population: 0, cost: 3500,
        powerDemand: 8, waterDemand: 4, jobs: 30, pollution: 10, traffic: 6, income: 800
    },
    park: { 
        emoji: '🌳', color: '#2ECC71', population: 0, cost: 500,
        powerDemand: 0, waterDemand: 1, happiness: 5, pollution: -3, crime: -2
    },
    metro: { 
        emoji: '🚇', color: '#E74C3C', population: 0, cost: 5000,
        powerDemand: 3, waterDemand: 1, traffic: -10, maintenance: 100
    },
    road: { 
        emoji: '🛣️', color: '#34495E', population: 0, cost: 200,
        powerDemand: 0, waterDemand: 0, traffic: -5, pollution: 1
    },
    hospital: { 
        emoji: '🏥', color: '#E74C3C', population: 0, cost: 8000,
        powerDemand: 6, waterDemand: 4, jobs: 15, happiness: 15, crime: -5, maintenance: 200
    },
    school: { 
        emoji: '🏫', color: '#F39C12', population: 0, cost: 5000,
        powerDemand: 4, waterDemand: 3, jobs: 10, happiness: 12, crime: -8, maintenance: 150
    },
    police: { 
        emoji: '👮', color: '#34495E', population: 0, cost: 6000,
        powerDemand: 3, waterDemand: 2, jobs: 12, crime: -20, maintenance: 180
    },
    powerplant: { 
        emoji: '⚡', color: '#F39C12', population: 0, cost: 10000,
        powerSupply: 100, waterDemand: 5, jobs: 8, pollution: 15, maintenance: 300
    },
    watertower: { 
        emoji: '💧', color: '#3498DB', population: 0, cost: 7000,
        waterSupply: 100, powerDemand: 2, jobs: 5, maintenance: 150
    },
    stadium: { 
        emoji: '🏟️', color: '#9B59B6', population: 0, cost: 15000,
        powerDemand: 10, waterDemand: 6, jobs: 25, happiness: 20, traffic: 15, income: 1000, maintenance: 400
    }
};

// Initialize grid
function initGrid() {
    cityGrid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
        cityGrid[row] = [];
        for (let col = 0; col < GRID_COLS; col++) {
            cityGrid[row][col] = null;
        }
    }
}

// Metro train class
class MetroTrain {
    constructor(stations) {
        this.id = trainIdCounter++;
        this.stations = stations;
        this.currentIndex = 0;
        this.nextIndex = 1;
        this.progress = 0;
        this.speed = 0.01;
        this.passengers = Math.floor(Math.random() * 20) + 5;
        
        if (stations.length > 0) {
            this.x = stations[0].x;
            this.y = stations[0].y;
        }
    }

    update() {
        if (isPaused || this.stations.length < 2) return;

        this.progress += this.speed;

        if (this.progress >= 1) {
            this.progress = 0;
            this.currentIndex = this.nextIndex;
            this.nextIndex = (this.currentIndex + 1) % this.stations.length;
            this.passengers = Math.floor(Math.random() * 30) + 5;
        }

        const from = this.stations[this.currentIndex];
        const to = this.stations[this.nextIndex];
        
        this.x = from.x + (to.x - from.x) * this.progress;
        this.y = from.y + (to.y - from.y) * this.progress;
    }

    draw() {
        if (this.stations.length < 2) return;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 8, 15, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Train
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(this.x - 15, this.y - 8, 30, 16);
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 15, this.y - 8, 30, 16);

        // Passengers
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.passengers}👥`, this.x, this.y + 3);
    }
}

// Update day/night cycle
function updateDayNight() {
    if (!isPaused) {
        timeOfDay += daySpeed;
        if (timeOfDay >= 24) {
            timeOfDay = 0;
        }
    }
    isNight = timeOfDay < 6 || timeOfDay >= 18;
}

// Draw city
function drawCity() {
    // Update time
    updateDayNight();
    
    // Sky with day/night cycle
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    if (timeOfDay >= 6 && timeOfDay < 18) {
        // Daytime
        const brightness = Math.sin((timeOfDay - 6) / 12 * Math.PI);
        const r = Math.floor(135 + brightness * 50);
        const g = Math.floor(206 + brightness * 20);
        const b = Math.floor(235 + brightness * 20);
        gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
        gradient.addColorStop(1, `rgb(${r-30}, ${g-30}, ${b-30})`);
    } else {
        // Nighttime
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stars at night
    if (isNight) {
        ctx.fillStyle = 'white';
        for (let i = 0; i < 100; i++) {
            const x = (i * 137.5) % canvas.width;
            const y = (i * 73.3) % (canvas.height / 2);
            const twinkle = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
            ctx.globalAlpha = twinkle;
            ctx.fillRect(x, y, 2, 2);
        }
        ctx.globalAlpha = 1.0;
    }
    
    // Sun/Moon
    const isDay = timeOfDay >= 6 && timeOfDay < 18;
    ctx.fillStyle = isDay ? '#FFD700' : '#F0F0F0';
    const celestialX = 50 + (timeOfDay / 24) * (canvas.width - 100);
    const celestialY = 50 + Math.abs(12 - timeOfDay) * 3;
    ctx.beginPath();
    ctx.arc(celestialX, celestialY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun/Moon glow
    if (!isDay) {
        const moonGlow = ctx.createRadialGradient(celestialX, celestialY, 20, celestialX, celestialY, 40);
        moonGlow.addColorStop(0, 'rgba(240, 240, 240, 0.3)');
        moonGlow.addColorStop(1, 'rgba(240, 240, 240, 0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, 40, 0, Math.PI * 2);
        ctx.fill();
    }

    // Grid
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    for (let col = 0; col <= GRID_COLS; col++) {
        ctx.beginPath();
        ctx.moveTo(col * GRID_SIZE, 0);
        ctx.lineTo(col * GRID_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let row = 0; row <= GRID_ROWS; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * GRID_SIZE);
        ctx.lineTo(canvas.width, row * GRID_SIZE);
        ctx.stroke();
    }

    // Draw metro lines first
    if (metroStations.length > 1) {
        ctx.strokeStyle = '#E74C3C';
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(metroStations[0].x, metroStations[0].y);
        for (let i = 1; i < metroStations.length; i++) {
            ctx.lineTo(metroStations[i].x, metroStations[i].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    // Draw buildings with lighting
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const building = cityGrid[row][col];
            if (building) {
                const x = col * GRID_SIZE;
                const y = row * GRID_SIZE;

                // Building background
                ctx.fillStyle = building.color;
                ctx.fillRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);

                // Night lighting effects
                if (isNight && building.type !== 'road' && building.type !== 'park') {
                    // Windows with lights
                    ctx.fillStyle = '#FFD700';
                    
                    // Different light patterns for different buildings
                    if (building.type === 'residential' || building.type === 'apartment') {
                        // Home lights (warm yellow)
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (Math.random() > 0.3) { // Some windows are dark
                                    ctx.fillRect(x + 8 + i * 12, y + 8 + j * 12, 8, 8);
                                }
                            }
                        }
                    } else if (building.type === 'commercial' || building.type === 'industrial') {
                        // Office/factory lights (bright white)
                        ctx.fillStyle = '#FFFFFF';
                        for (let i = 0; i < 4; i++) {
                            for (let j = 0; j < 4; j++) {
                                if (Math.random() > 0.2) {
                                    ctx.fillRect(x + 6 + i * 10, y + 6 + j * 10, 6, 6);
                                }
                            }
                        }
                    } else if (building.type === 'hospital' || building.type === 'school') {
                        // Service building lights
                        ctx.fillStyle = '#87CEEB';
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                ctx.fillRect(x + 10 + i * 12, y + 10 + j * 12, 7, 7);
                            }
                        }
                    } else if (building.type === 'powerplant') {
                        // Power plant glow
                        const glow = ctx.createRadialGradient(
                            x + GRID_SIZE / 2, y + GRID_SIZE / 2, 0,
                            x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE
                        );
                        glow.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
                        glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
                        ctx.fillStyle = glow;
                        ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
                    } else if (building.type === 'stadium') {
                        // Stadium floodlights
                        const floodlight = ctx.createRadialGradient(
                            x + GRID_SIZE / 2, y + GRID_SIZE / 2, 0,
                            x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE * 1.5
                        );
                        floodlight.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
                        floodlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
                        ctx.fillStyle = floodlight;
                        ctx.fillRect(x - GRID_SIZE / 2, y - GRID_SIZE / 2, GRID_SIZE * 2, GRID_SIZE * 2);
                    }
                }

                // Emoji
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(building.emoji, x + GRID_SIZE / 2, y + GRID_SIZE / 2);
            }
        }
    }
    
    // Night overlay for atmosphere
    if (isNight) {
        ctx.fillStyle = 'rgba(0, 0, 20, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw trains
    trains.forEach(train => {
        train.update();
        train.draw();
    });

    // Draw hover preview
    if (selectedTool && selectedTool !== 'delete') {
        const mousePos = getMouseGridPos();
        if (mousePos && !cityGrid[mousePos.row][mousePos.col]) {
            const x = mousePos.col * GRID_SIZE;
            const y = mousePos.row * GRID_SIZE;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
            ctx.strokeStyle = budget >= selectedToolCost ? '#2ECC71' : '#E74C3C';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
            
            const building = BUILDINGS[selectedTool];
            ctx.font = '30px Arial';
            ctx.globalAlpha = 0.7;
            ctx.fillText(building.emoji, x + GRID_SIZE / 2, y + GRID_SIZE / 2);
            ctx.globalAlpha = 1.0;
        }
    }
}

// Get mouse grid position
let currentMousePos = null;
function getMouseGridPos() {
    return currentMousePos;
}

// Canvas click handler
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / GRID_SIZE);
    const row = Math.floor(y / GRID_SIZE);
    
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
        placeBuilding(row, col);
    }
});

// Mouse move for preview
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / GRID_SIZE);
    const row = Math.floor(y / GRID_SIZE);
    
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
        currentMousePos = { row, col };
    } else {
        currentMousePos = null;
    }
});

canvas.addEventListener('mouseleave', () => {
    currentMousePos = null;
});

// Place building
function placeBuilding(row, col) {
    if (!selectedTool) {
        showFeedback('Select a tool first!', 'error');
        return;
    }

    if (selectedTool === 'delete') {
        if (cityGrid[row][col]) {
            const building = cityGrid[row][col];
            cityGrid[row][col] = null;
            
            // Remove from metro stations if it was one
            if (building.type === 'metro') {
                metroStations = metroStations.filter(s => !(s.row === row && s.col === col));
                updateMetroSystem();
            }
            
            updateCityStats();
            showFeedback('Building removed!', 'info');
        }
        return;
    }

    if (cityGrid[row][col]) {
        showFeedback('Space already occupied!', 'error');
        return;
    }

    const building = BUILDINGS[selectedTool];
    if (budget < building.cost) {
        showFeedback('Not enough budget!', 'error');
        return;
    }

    // Place building
    cityGrid[row][col] = {
        type: selectedTool,
        ...building
    };

    budget -= building.cost;

    // Add to metro stations
    if (selectedTool === 'metro') {
        metroStations.push({
            row,
            col,
            x: col * GRID_SIZE + GRID_SIZE / 2,
            y: row * GRID_SIZE + GRID_SIZE / 2
        });
        updateMetroSystem();
    }

    updateCityStats();
    showFeedback(`${building.emoji} Built!`, 'success');
}

// Update metro system
function updateMetroSystem() {
    if (metroStations.length >= 2) {
        // Create trains if needed
        const neededTrains = Math.min(Math.floor(metroStations.length / 2), 5);
        if (trains.length < neededTrains) {
            trains.push(new MetroTrain(metroStations));
        } else if (trains.length > neededTrains) {
            trains = trains.slice(0, neededTrains);
        }
        
        // Update existing trains
        trains.forEach(train => {
            train.stations = metroStations;
        });
    } else {
        trains = [];
    }
}

// Update city stats - REALISTIC SIMULATION
function updateCityStats() {
    // Reset all metrics
    population = 0;
    powerSupply = 0;
    powerDemand = 0;
    waterSupply = 0;
    waterDemand = 0;
    pollution = 0;
    crime = 10; // Base crime
    traffic = 0;
    employment = 0;
    unemployed = 0;
    monthlyIncome = 0;
    monthlyExpenses = 0;
    
    let happinessModifiers = 0;
    let buildingCount = 0;
    
    // Calculate all building effects
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const building = cityGrid[row][col];
            if (building) {
                buildingCount++;
                
                // Population
                population += building.population || 0;
                
                // Power
                powerSupply += building.powerSupply || 0;
                powerDemand += building.powerDemand || 0;
                
                // Water
                waterSupply += building.waterSupply || 0;
                waterDemand += building.waterDemand || 0;
                
                // Jobs
                employment += building.jobs || 0;
                
                // Pollution
                pollution += building.pollution || 0;
                
                // Traffic
                traffic += building.traffic || 0;
                
                // Crime
                crime += building.crime || 0;
                
                // Happiness modifiers
                happinessModifiers += building.happiness || 0;
                
                // Income
                monthlyIncome += building.income || 0;
                
                // Maintenance costs
                monthlyExpenses += building.maintenance || 0;
            }
        }
    }
    
    // Calculate unemployment
    unemployed = Math.max(0, population - employment);
    
    // Tax income from population
    monthlyIncome += Math.floor(population * taxRate * 100);
    
    // Calculate happiness (0-100)
    happiness = 50; // Base
    
    // Power shortage penalty
    if (powerDemand > powerSupply) {
        happiness -= 20;
    }
    
    // Water shortage penalty
    if (waterDemand > waterSupply) {
        happiness -= 20;
    }
    
    // Unemployment penalty
    if (unemployed > 0) {
        happiness -= Math.min(20, unemployed / 2);
    }
    
    // Pollution penalty
    happiness -= Math.min(15, pollution / 5);
    
    // Crime penalty
    happiness -= Math.min(15, Math.max(0, crime) / 3);
    
    // Traffic penalty
    happiness -= Math.min(10, Math.max(0, traffic) / 10);
    
    // Add positive modifiers
    happiness += happinessModifiers;
    
    // Clamp happiness
    happiness = Math.max(0, Math.min(100, Math.floor(happiness)));
    
    // Ensure non-negative values
    pollution = Math.max(0, pollution);
    crime = Math.max(0, crime);
    traffic = Math.max(0, traffic);
    
    updateUI();
}

// Monthly budget cycle
let monthTimer = 0;
function processMonthlyBudget() {
    monthTimer++;
    if (monthTimer >= 300) { // Every 5 seconds = 1 month
        monthTimer = 0;
        
        const netIncome = monthlyIncome - monthlyExpenses;
        budget += netIncome;
        
        if (netIncome > 0) {
            showFeedback(`💰 Monthly profit: +$${netIncome}`, 'success');
        } else if (netIncome < 0) {
            showFeedback(`💸 Monthly loss: $${netIncome}`, 'error');
        }
        
        updateUI();
    }
}

// Update UI
function updateUI() {
    document.getElementById('population').textContent = population;
    document.getElementById('budget').textContent = budget.toLocaleString();
    document.getElementById('happiness').textContent = happiness;
    
    // Power status with color
    const powerStatus = document.getElementById('power-status');
    powerStatus.textContent = `${powerDemand}/${powerSupply}`;
    powerStatus.style.color = powerDemand > powerSupply ? '#E74C3C' : '#2ECC71';
    
    // Water status with color
    const waterStatus = document.getElementById('water-status');
    waterStatus.textContent = `${waterDemand}/${waterSupply}`;
    waterStatus.style.color = waterDemand > waterSupply ? '#E74C3C' : '#2ECC71';
    
    document.getElementById('pollution').textContent = pollution;
    document.getElementById('employment').textContent = employment;
    document.getElementById('unemployed').textContent = unemployed;
    document.getElementById('traffic').textContent = traffic;
    document.getElementById('crime').textContent = crime;
    document.getElementById('income').textContent = monthlyIncome.toLocaleString();
    document.getElementById('expenses').textContent = monthlyExpenses.toLocaleString();
    
    // Time of day display
    const hours = Math.floor(timeOfDay / 60);
    const minutes = Math.floor(timeOfDay % 60);
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const period = isNight ? '🌙' : '☀️';
    document.getElementById('time-display').textContent = `${period} ${timeString}`;
}

// Tool selection
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        selectedTool = btn.dataset.tool;
        selectedToolCost = parseInt(btn.dataset.cost);
        
        const building = BUILDINGS[selectedTool];
        if (building) {
            document.getElementById('tool-info').textContent = 
                `Selected: ${building.emoji} ${selectedTool} - Cost: $${building.cost}`;
        } else {
            document.getElementById('tool-info').textContent = 'Selected: Delete tool';
        }
    });
});

// Controls
document.getElementById('pause-btn').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pause-btn').textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
    document.getElementById('city-status').textContent = 
        isPaused ? '⏸️ City paused' : '🏗️ Click on the map to place buildings!';
});

document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Clear entire city? This cannot be undone!')) {
        initGrid();
        metroStations = [];
        trains = [];
        population = 0;
        budget = 50000;
        happiness = 50;
        powerSupply = 0;
        powerDemand = 0;
        waterSupply = 0;
        waterDemand = 0;
        pollution = 0;
        crime = 0;
        traffic = 0;
        monthTimer = 0;
        updateUI();
        showFeedback('City cleared!', 'info');
    }
});

document.getElementById('auto-metro-btn').addEventListener('click', () => {
    if (metroStations.length < 2) {
        showFeedback('Build at least 2 metro stations first!', 'error');
        return;
    }
    
    const trainCount = Math.min(Math.floor(metroStations.length / 2), 5);
    trains = [];
    for (let i = 0; i < trainCount; i++) {
        trains.push(new MetroTrain(metroStations));
    }
    showFeedback(`${trainCount} trains deployed!`, 'success');
});

document.getElementById('speed-day-btn').addEventListener('click', () => {
    daySpeed = daySpeed === 2 ? 10 : daySpeed === 10 ? 30 : 2;
    const speedText = daySpeed === 2 ? '1x' : daySpeed === 10 ? '5x' : '15x';
    document.getElementById('speed-day-btn').textContent = `⏩ Time: ${speedText}`;
    showFeedback(`Time speed: ${speedText}`, 'info');
});

// Feedback
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 2000);
}

// Animation loop with monthly budget
function animate() {
    drawCity();
    
    if (!isPaused) {
        processMonthlyBudget();
    }
    
    requestAnimationFrame(animate);
}

// Initialize
initGrid();
animate();
showFeedback('🏗️ Welcome! Start building your city!', 'success');
