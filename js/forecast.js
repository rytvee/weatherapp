const form = document.getElementById("weatherForm");
const weatherDiv = document.getElementById("weather");
const dateInput = document.getElementById("dateInput");

// Dynamic placeholder (MM/dd/YYYY)
function setDynamicPlaceholder(input) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  input.setAttribute("placeholder", `${month}/dd/${year}`);
}

// Initialize placeholder and update every minute
setDynamicPlaceholder(dateInput);
setInterval(() => setDynamicPlaceholder(dateInput), 60000);

// Set min/max dates (for validation)
const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 2);

function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Form submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = document.getElementById("cityInput").value.trim();
  const targetDate = dateInput.value;
  weatherDiv.style.display = "none";

  if (!city || !targetDate) return;

  // Convert user input to date
  const parts = targetDate.split("/"); // expecting MM/dd/YYYY
  if (parts.length !== 3) {
    weatherDiv.innerHTML = `<p style="color:red;">Please enter date in MM/dd/YYYY format.</p>`;
    weatherDiv.style.display = "block";
    return;
  }

  const selected = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
  if (isNaN(selected)) {
    weatherDiv.innerHTML = `<p style="color:red;">Invalid date.</p>`;
    weatherDiv.style.display = "block";
    return;
  }

  const diffTime = selected.getTime() - new Date().getTime();
  const daysAhead = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysAhead < 0 || daysAhead > 2) {
    weatherDiv.innerHTML = `<p style="color:red;">Please choose a date within the next 3 days.</p>`;
    weatherDiv.style.display = "block";
    return;
  }

  const apiBaseUrl = "https://weather-api-proxy-8dzt.vercel.app";

  fetch(`${apiBaseUrl}/api/forecast?city=${encodeURIComponent(city)}&days=${daysAhead + 1}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch forecast");
      return res.json();
    })
    .then(data => {
      const dayData = data.forecast.forecastday.find(day => day.date === formatDate(selected));
      if (!dayData) {
        weatherDiv.innerHTML = `<p style="color:red;">No forecast available for the selected date.</p>`;
        weatherDiv.style.display = "block";
        return;
      }

      weatherDiv.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <h3>${dayData.date}</h3>
        <img src="https:${dayData.day.condition.icon}" alt="${dayData.day.condition.text}" onerror="this.style.display='none'">
        <p><strong>Condition:</strong> ${dayData.day.condition.text}</p>
        <p><strong>Max Temp:</strong> ${dayData.day.maxtemp_c}°C</p>
        <p><strong>Min Temp:</strong> ${dayData.day.mintemp_c}°C</p>
      `;
      weatherDiv.style.display = "block";
    })
    .catch(err => {
      console.error(err);
      weatherDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
      weatherDiv.style.display = "block";
    });
});
