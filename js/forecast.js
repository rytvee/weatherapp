const form = document.getElementById("weatherForm");
const weatherDiv = document.getElementById("weather");
const dateInput = document.getElementById("dateInput");
const calendarIcon = document.getElementById("calendarIcon");
const datePlaceholder = document.getElementById("datePlaceholder");

// Detect mobile devices
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Set min/max dates (today → next 3 days)
const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 2);

function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// --- MOBILE ---
if (isMobile()) {
  // Fake placeholder
  function setFakePlaceholder() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    datePlaceholder.textContent = `${month}/dd/${year}`;
  }
  setFakePlaceholder();

  // Flatpickr setup
  dateInput.setAttribute("type", "text");
  dateInput.setAttribute("readonly", true);

  const fp = flatpickr(dateInput, {
    dateFormat: "m/d/Y",
    minDate: "today",
    maxDate: new Date().fp_incr(2),
    allowInput: false,
    onChange: function (selectedDates, dateStr) {
      if (dateStr) {
        dateInput.classList.add("has-value"); // hide fake placeholder
      } else {
        dateInput.classList.remove("has-value"); // show fake placeholder
      }
    }
  });

  // Calendar icon opens Flatpickr
  calendarIcon.addEventListener("click", () => {
    fp.open();
  });

// --- DESKTOP ---
} else {
  dateInput.setAttribute("type", "date");
  dateInput.min = formatDate(today);
  dateInput.max = formatDate(maxDate);

  // Calendar icon triggers native picker
  calendarIcon.addEventListener("click", () => {
    try {
      if (dateInput.showPicker) dateInput.showPicker();
      else dateInput.click();
    } catch {
      dateInput.click();
    }
  });
}

// --- Form submit handler ---
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = document.getElementById("cityInput").value.trim();
  const targetDate = dateInput.value.trim();
  weatherDiv.style.display = "none";

  if (!city || !targetDate) return;

  const selected = new Date(targetDate);

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
