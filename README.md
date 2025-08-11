# 🌦 Weather Forecast App
A simple JavaScript web application that displays the current weather and a 2-day forecast for any city.
The app fetches real-time weather data using a public weather API and shows details such as temperature, weather condition, humidity, and more.

## 🌐 Live Demo
You can try the app here:
[Live Weather App](https://rytvee.github.io/weatherapp/)

## ✨ Features
- 🌍 Search for any city worldwide
- 🌤 View current weather (temperature, humidity, description)
- 📅 See 2-day weather forecast ahead
- 📱 Fully responsive design for desktop and mobile
- 🗓 Built-in date picker for easy date selection

## 🛠 Technologies Used
- HTML5 – Structure of the app
- CSS3 – Styling and responsive layout
- JavaScript (Vanilla JS) – Core logic and API handling
- OpenWeatherMap API – For weather data

## 📂 Project Structure
```text
weatherapp/
│── index.html             # Main HTML layout (check current weather)
│── forecast.html          # HTML layout for getting weather forecast
│── style.css              # CSS for styling
│── README.md              # Documentation
│
├── weather-api-proxy/     # Secure backend layer (Vercel serverless functions)
│ ├── weather.js           # Current weather API endpoint
│ └── forecast.js          # Weather forecast API endpoint
│
├── js/                    # JavaScript logic (API calls, UI interaction)
│ ├── weather.js           # Current weather logic
│ └── forecast.js          # Weather forecast logic
│
└── images/                # Weather icons and assets
```

## 📂 weather-api-proxy/
This folder contains the serverless API endpoint used when the app is deployed to Vercel.
Acts as a proxy between the browser and the external weather API.
The API key is stored securely in Vercel Environment Variables (or .env for local development).
Prevents the API key from being exposed in client-side code.

## 📦 Installation
1. **Clone this repository:**  
   - `git clone https://github.com/rytvee/weatherapp.git`  
   - `cd weatherapp`  

2. **Local Development (with Node.js)**  
   - Create a `.env` file inside the `weather-api-proxy/` folder:  
     `WEATHER_API_KEY=your_actual_api_key_here`  
   - Install dependencies in the `weather-api-proxy/` folder:  
     `cd weather-api-proxy`  
     `npm install`  
   - Run locally using Vercel CLI:  
     `vercel dev`  

3. **Deployment**  
   - **Frontend (GitHub Pages)**  
     Commit and push your `index.html`, `style.css`, and `script.js` to the main branch.  
     Enable GitHub Pages in repository settings (set branch to main / root).  
     Access it at:  
     https://your-username.github.io/weatherapp/ 

   - **Backend API Proxy (Vercel)**  
     Go to Vercel, import your repo.  
     Set the `WEATHER_API_KEY` environment variable in Vercel settings.  
     Deploy — your API will be available at:  
     https://your-vercel-project.vercel.app/api/weather


## 🔄 How It Works
**Browser (GitHub Pages frontend)**  
&nbsp;&nbsp;&nbsp;&nbsp;↓ request to `/api/weather`  
**Vercel Serverless Function** (`weather-api-proxy/`)  
&nbsp;&nbsp;&nbsp;&nbsp;↓ attaches API key from environment  
**External Weather API**  
&nbsp;&nbsp;&nbsp;&nbsp;↑ returns data to Vercel  
**Vercel → Browser**  

✅ Fast static hosting via GitHub Pages.  
🔒 Secure API key handling via Vercel serverless function.  


## 🚀 Usage
1. Enter a city name in the search box.
2. Click "Get Weather" or press Enter.
3. View the current weather and 2-day forecast displayed on screen.

## 📌 Screenshots
**index.html (check current weather)**
<img width="1331" height="982" alt="image" src="https://github.com/user-attachments/assets/4077f445-93a2-4ce8-8434-c5cfe47a9a1a" />

**index.html (check current weather result)**
<img width="1350" height="995" alt="image" src="https://github.com/user-attachments/assets/ebb94a7e-314c-4e2c-a3d9-78836fb70949" />

**forecast.html (forecast weather)**
<img width="1343" height="999" alt="image" src="https://github.com/user-attachments/assets/5bffd9e1-a538-4f8c-9bba-4ad4c750554a" />

**forecast.html (forecast weather date picker)**
<img width="1337" height="987" alt="image" src="https://github.com/user-attachments/assets/f9195c0c-0358-42bb-9b0d-555b2d34ffdf" />

**forecast.html (forecast weather result)**
<img width="1344" height="995" alt="image" src="https://github.com/user-attachments/assets/b711912c-80e0-40e9-bea5-f64740468563" />


## 📜 License
This project is free to use and modify.

