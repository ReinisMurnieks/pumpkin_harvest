# 🏙️ Real City Building Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A realistic city-building simulation game with complex systems including power, water, employment, pollution, traffic, and crime management!

## Features

### 🎮 Realistic City Simulation
- **Power System** ⚡ - Build power plants to supply electricity
- **Water System** 💧 - Build water towers for water supply
- **Employment** 👔 - Balance jobs and population
- **Pollution** 🏭 - Industrial buildings pollute, parks clean air
- **Traffic** 🚗 - Roads and metro reduce congestion
- **Crime** 🚔 - Police stations reduce crime
- **Monthly Budget** 💰 - Income from taxes and buildings, expenses from maintenance

### 🏗️ 13 Building Types

**Residential:**
- 🏠 House ($1k) - 15 population
- 🏘️ Apartment ($3k) - 40 population

**Economic:**
- 🏢 Office ($2.5k) - 20 jobs, $500/month income
- 🏭 Factory ($3.5k) - 30 jobs, $800/month income, high pollution

**Infrastructure:**
- ⚡ Power Plant ($10k) - Supplies 100 power units
- 💧 Water Tower ($7k) - Supplies 100 water units
- 🛣️ Road ($200) - Reduces traffic
- 🚇 Metro Station ($5k) - Major traffic reduction

**Services:**
- 🏥 Hospital ($8k) - +15% happiness, -5 crime, 15 jobs
- 🏫 School ($5k) - +12% happiness, -8 crime, 10 jobs
- 👮 Police Station ($6k) - -20 crime, 12 jobs
- 🌳 Park ($500) - +5% happiness, -3 pollution, -2 crime

**Entertainment:**
- 🏟️ Stadium ($15k) - +20% happiness, 25 jobs, $1000/month income

## How to Play

### Starting Out:
1. **Build Power & Water First!** ⚡💧
   - Power plant supplies 100 units
   - Water tower supplies 100 units
   - All buildings need power and water

2. **Create Residential Zones** 🏠
   - Houses and apartments bring population
   - Population pays taxes

3. **Provide Jobs** 🏢🏭
   - Build offices and factories
   - Unemployed citizens = unhappy citizens

4. **Manage Happiness** 😊
   - Build parks, hospitals, schools
   - Reduce pollution and crime
   - Keep power/water supplied

5. **Balance Budget** 💰
   - Monthly income from taxes and businesses
   - Monthly expenses from building maintenance
   - Every 5 seconds = 1 month

### Key Metrics:

**Population** 👥 - More people = more taxes
**Budget** 💰 - Don't go bankrupt!
**Happiness** 😊 - Keep above 50% or people leave
**Power** ⚡ - Demand/Supply (red = shortage)
**Water** 💧 - Demand/Supply (red = shortage)
**Pollution** 🏭 - Lower is better
**Employment** 👔 - Jobs/Unemployed
**Traffic** 🚗 - Build roads and metro
**Crime** 🚔 - Build police stations
**Income** 💵 - Monthly revenue
**Expenses** 💸 - Monthly costs

### Happiness Factors:
- ✅ Power supplied
- ✅ Water supplied
- ✅ Low unemployment
- ✅ Low pollution
- ✅ Low crime
- ✅ Low traffic
- ✅ Parks, hospitals, schools

## Installation

```bash
pip install -r requirements.txt
python app.py
```

Visit: `http://localhost:5000`

## Strategy Tips

1. **Start with utilities** - Power plant + water tower first
2. **Balance zones** - Mix residential, commercial, industrial
3. **Fight pollution** - Build parks near factories
4. **Reduce crime** - Police stations in high-crime areas
5. **Manage traffic** - Roads and metro stations
6. **Watch your budget** - Don't overbuild
7. **Keep happiness high** - Happy citizens = more tax revenue
8. **Plan ahead** - Leave space for expansion

## Advanced Gameplay

- **Zoning Strategy**: Separate industrial from residential
- **Transit Planning**: Connect metro stations efficiently
- **Budget Management**: Balance income vs expenses
- **Crisis Management**: Handle power/water shortages
- **Growth Planning**: Expand sustainably

## Future Features

- Natural disasters
- Seasons and weather
- Tourism system
- Education levels
- Healthcare system
- Fire department
- Airports and seaports
- Save/load cities
- City statistics graphs
- Achievements system
