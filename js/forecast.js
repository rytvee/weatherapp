const form = document.getElementById("weatherForm");
const weatherDiv = document.getElementById("weather");
const dateInput = document.getElementById("dateInput");
const calendarIcon = document.getElementById("calendarIcon");

// Detect mobile devices
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Set min/max date (next 3 days)
const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 2);

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

dateInput.min = formatDate(today);
dateInput.max = formatDate(maxDate);

// Function to set dynamic placeholder (MM/dd/YYYY)
function setDynamicPlaceholder(input) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  input.setAttribute("placeholder", `${month}/dd/${year}`);
}

let fp; // Flatpickr instance

if (isMobile()) {
  // Mobile → hide native picker, show dynamic placeholder, use Flatpickr
  dateInput.setAttribute("type", "text");
  dateInput.setAttribute("readonly", true); // prevent typing
  setDynamicPlaceholder(dateInput);

  fp = flatpickr(dateInput, {
    minDate: today,
    maxDate: maxDate,
    dateFormat: "Y-m-d",
    clickOpens: false, // only open on icon click
  });

  // Open Flatpickr on icon click
  calendarIcon.addEventListener("click", () => fp.open());
} else {
  // Desktop → native picker, icon triggers showPicker
  calendarIcon.addEventListener("click", () => {
    try {
      if (dateInput.showPicker) {
        dateInput.showPicker();
      } else {
        dateInput.click();
      }
    } catch {
      dateInput.click();
    }
  });
}

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
