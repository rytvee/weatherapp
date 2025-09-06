document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weatherForm");
  const weatherDiv = document.getElementById("weather");
  const dateInput = document.getElementById("dateInput");
  const calendarIcon = document.getElementById("calendarIcon");

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 2);

  function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  function setDynamicPlaceholder(input) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    input.setAttribute("placeholder", `${month}/dd/${year}`);
  }

  // Always initialize placeholder
  setDynamicPlaceholder(dateInput);
  setInterval(() => setDynamicPlaceholder(dateInput), 60000);

  if (isMobile()) {
    // Mobile → use Flatpickr
    dateInput.setAttribute("type", "text"); // important for Flatpickr
    dateInput.setAttribute("readonly", true); // prevent typing

    const fp = flatpickr(dateInput, {
      minDate: today,
      maxDate: maxDate,
      dateFormat: "Y-m-d",
      allowInput: false,
    });

    // Only open Flatpickr on calendar icon click
    calendarIcon.addEventListener("click", () => fp.open());

  } else {
    // Desktop → native picker
    dateInput.setAttribute("type", "date");
    dateInput.min = formatDate(today);
    dateInput.max = formatDate(maxDate);

    calendarIcon.addEventListener("click", () => {
      try {
        if (dateInput.showPicker) dateInput.showPicker();
        else dateInput.click();
      } catch {
        dateInput.click();
      }
    });
  }

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    const targetDate = dateInput.value;
    weatherDiv.style.display = "none";

    if (!city || !targetDate) return;

    const selected = new Date(targetDate);
    const daysAhead = Math.ceil((selected - new Date()) / (1000 * 60 * 60 * 24));

    if (daysAhead < 0 || daysAhead > 2) {
      weatherDiv.innerHTML = `<p style="color:red;">Please choose a date within the next 3 days.</p>`;
      weatherDiv.style.display = "block";
      return;
    }

    fetch(`https://weather-api-proxy-8dzt.vercel.app/api/forecast?city=${encodeURIComponent(city)}&days=${daysAhead + 1}`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch forecast"))
      .then(data => {
        const dayData = data.forecast.forecastday.find(day => day.date === targetDate);
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
        weatherDiv.innerHTML = `<p style="color:red;">${err}</p>`;
        weatherDiv.style.display = "block";
      });
  });
});
