const form = document.getElementById("weatherForm");
const weatherDiv = document.getElementById("weather");
const dateInput = document.getElementById("dateInput");
const calendarIcon = document.getElementById("calendarIcon");

// Detect mobile devices
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Set dynamic placeholder (MM/dd/YYYY)
function setDynamicPlaceholder(input) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  input.setAttribute("placeholder", `${month}/dd/${year}`);
}

// Initialize placeholder
setDynamicPlaceholder(dateInput);
// Update placeholder every minute (if month changes)
setInterval(() => setDynamicPlaceholder(dateInput), 60000);

// Set min/max dates (next 3 days)
const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 2);

function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Mobile: remove native picker, show placeholder
if (isMobile()) {
  dateInput.setAttribute("type", "text");
} else {
  // Desktop: native date picker
  dateInput.setAttribute("type", "date");
  dateInput.min = formatDate(today);
  dateInput.max = formatDate(maxDate);
}

// Calendar icon triggers picker if available
calendarIcon.addEventListener("click", () => {
  try {
    if (dateInput.showPicker) dateInput.showPicker(); // Chrome/Edge/Safari
    else dateInput.click(); // fallback
  } catch {
    dateInput.click();
  }
});

// Form submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = document.getElementById("cityInput").value.trim();
  const targetDate = dateInput.value.trim();
  weatherDiv.style.display = "none";

  if (!city || !targetDate) return;

  let selected;

  if (isMobile()) {
    // Parse MM/dd/YYYY for mobile
    const parts = targetDate.split("/");
    if (parts.length !== 3) {
      weatherDiv.innerHTML = `<p style="color:red;">Enter a valid date in MM/dd/YYYY format.</p>`;
      weatherDiv.style.display = "block";
      return;
    }
    const month = parseInt(parts[0], 10) - 1; // JS months 0-11
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    selected = new Date(year, month, day);
  } else {
    // Desktop
    selected = new Date(targetDate);
  }

  if (isNaN(selected.getTime())) {
    weatherDiv.innerHTML = `<p style="color:red;">Enter a valid date.</p>`;
    weatherDiv.style.display = "block";
    return;
  }

  // Check if selected date is within next 3 days
  const diffTime = selected.getTime() - today.getTime();
  const daysAhead = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (daysAhead < 0 || daysAhead > 2) {
    weatherDiv.innerHTML = `<p style="color:red;">Please choose a date within the next 3 days.</p>`;
    weatherDiv.style.display = "block";
    return;
  }

  const isoDate = formatDate(selected);
  const apiBaseUrl = "https://weather-api-proxy-8dzt.vercel.app";

  fetch(`${apiBaseUrl}/api/forecast?city=${encodeURIComponent(city)}&days=${daysAhead + 1}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch forecast");
      return res.json();
    })
    .then(data => {
      const dayData = data.forecast.forecastday.find(day => day.date === isoDate);

      if (!dayData) {
        weatherDiv.innerHTML = `<p style="color:red;">No forecast available for the selected date.</p>`;
        weatherDiv.style.display = "block";
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
      console.error(err);
      weatherDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
      weatherDiv.style.display = "block";
    });
});
