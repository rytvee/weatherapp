# 🌦 Weather Forecast App
A simple JavaScript web application that displays the current weather and a 2-day forecast for any city.
The app fetches real-time weather data using a public weather API and shows details such as temperature, weather condition, humidity, and more.

## 🌐 Live Demo
You can try the app here:
[Live Weather App on GitHub Pages](https://rytvee.github.io/weatherapp/)

## ✨ Features
- 🌍 Search for any city worldwide
- 🌤 View current weather (temperature, conditions, humidity, wind speed, etc.)
- 📅 See 2-day weather forecast ahead
- 📱 Fully responsive design for desktop and mobile
- 🗓 Built-in date picker for easy date selection

## 🛠 Technologies Used
- HTML5 – Structure of the app
- CSS3 – Styling and responsive layout
- JavaScript (Vanilla JS) – Core logic and API handling
- OpenWeatherMap API – For weather data

## 📂 Project Structure
<pre> ```plaintext weatherapp/ │── index.html # Main HTML layout (check current weather) │── forecast.html # HTML layout for getting weather forecast │── style.css # CSS for styling │── README.md # Documentation │ ├── weather-api-proxy/ # Secure backend layer (Vercel serverless functions) │ ├── weather.js # Current weather API endpoint │ └── forecast.js # Weather forecast API endpoint │ ├── js/ # JavaScript logic (API calls, UI interaction) │ ├── weather.js # Current weather logic │ └── forecast.js # Weather forecast logic │ └── images/ # Weather icons and assets ``` </pre>

## 📂 weather-api-proxy/
This folder contains the serverless API endpoint used when the app is deployed to Vercel.
Acts as a proxy between the browser and the external weather API.
The API key is stored securely in Vercel Environment Variables (or .env for local development).
Prevents the API key from being exposed in client-side code.

## 📦 Installation
1. Clone this repository:
   git clone https://github.com/rytvee/weatherapp.git
   cd weatherapp
2. Local Development (with Node.js)
   - Create a .env file inside the weather-api-proxy/ folder:
     WEATHER_API_KEY=your_actual_api_key_here
    - Install dependencies in the weather-api-proxy/ folder:
      cd weather-api-proxy
      npm install
   - Run locally using Vercel CLI:
     vercel dev
3. Deployment
   - Frontend (GitHub Pages)
     Commit and push your index.html, style.css, and script.js to the main branch.
     Enable GitHub Pages in repository settings (set branch to main / root).
     Access it at: https://your-username.github.io/weatherapp/
   - Backend API Proxy (Vercel)
     Go to Vercel, import your repo.
     Set the WEATHER_API_KEY environment variable in Vercel settings.
     Deploy — your API will be available at: https://your-vercel-project.vercel.app/api/weather

## 🔄 How It Works
Browser (GitHub Pages frontend)
     ↓ request to /api/weather
Vercel Serverless Function (weather-api-proxy/)
     ↓ attaches API key from environment
External Weather API
     ↑ returns data to Vercel
Vercel → Browser
✅ Fast static hosting via GitHub Pages.
🔒 Secure API key handling via Vercel serverless function.

## 🚀 Usage
1. Enter a city name in the search box.
2. Click "Get Weather" or press Enter.
3. View the current weather and 2-day forecast displayed on screen.

## 📌 Screenshots

## 📜 License
This project is licensed under the MIT License – free to use and modify.

