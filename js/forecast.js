const form = document.getElementById("weatherForm"); 
const weatherDiv = document.getElementById("weather");
const dateInput = document.getElementById("dateInput");
const calendarIcon = document.getElementById("calendarIcon");

// Detect mobile devices
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Mobile → remove chevron, show placeholder
if (isMobile()) {
  dateInput.setAttribute("type", "text");
  dateInput.setAttribute("placeholder", "09/dd/2025");

  // Open native picker on focus
  dateInput.addEventListener("focus", () => {
    if (dateInput.showPicker) {
      dateInput.showPicker();
    }
  });
} 

// Calendar icon always triggers picker
calendarIcon.addEventListener("click", () => {
  try {
    if (dateInput.showPicker) {
      dateInput.showPicker(); // Chrome/Edge/Safari
    } else {
      dateInput.click(); // fallback
    }
  } catch (err) {
    dateInput.click();
  }
});

// Set min/max date (next 3 days)
const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 2);

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

dateInput.min = formatDate(today);
dateInput.max = formatDate(maxDate);

// Form submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = document.getElementById("cityInput").value.trim();
  const targetDate = dateInput.value;
  weatherDiv.style.display = "none";

  if (!city || !targetDate) return;

  const selected = new Date(targetDate);
  const diffTime = selected.getTime() - new Date().getTime();
  const daysAhead = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysAhead < 0 || daysAhead > 2) {
    weatherDiv.innerHTML = `<p style="color:red;">Please choose a date within the next 3 days.</p>`;
    weatherDiv.style.display = "block";
    return;
  }

  // Replace with your actual Vercel URL
  const apiBaseUrl = "https://weather-api-proxy-8dzt.vercel.app";

  fetch(`${apiBaseUrl}/api/forecast?city=${encodeURIComponent(city)}&days=${daysAhead + 1}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch forecast");
      return res.json();
    })
    .then(data => {
      const dayData = data.forecast.forecastday.find(day => day.date === targetDate);

      if (!dayData) {
        weatherDiv.innerHTML = `<p style="color:red;">No forecast available for the selected date.</p>`;
        weatherDiv.style.display = "inline-block";
        return;
      }

      weatherDiv.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <h3>${dayData.date}</h3>
        <img src="https:${dayData.day.condition.icon}" 
             alt="${dayData.day.condition.text}" 
             onerror="this.style.display='none'">
        <p><strong>Condition:</strong> ${dayData.day.condition.text}</p>
        <p><strong>Max Temp:</strong> ${dayData.day.maxtemp_c}°C</p>
        <p><strong>Min Temp:</strong> ${dayData.day.mintemp_c}°C</p>
      `;
      weatherDiv.style.display = "block";
    })
    .catch(err => {
      console.error("Error:", err);
      weatherDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
      weatherDiv.style.display = "block";
    });
});
