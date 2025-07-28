const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");

const BACKEND_URL = "https://weather-api-proxy-zeta.vercel.app/api/weather";

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city === "") return;

  console.log("Searching for:", city); // ✅ Debug

  fetch(`${BACKEND_URL}?city=${encodeURIComponent(city)}`)
    .then(response => {
      console.log("Response received:", response.status); // ✅ Debug
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      console.log("Data received:", data); // ✅ Debug

      const temp = data.current.temp_c;
      const condition = data.current.condition.text;
      const icon = data.current.condition.icon;
      const location = `${data.location.name}, ${data.location.country}`;

      weatherDiv.innerHTML = `
        <h2>${location}</h2>
        <img src="https:${icon}" alt="${condition}"/>
        <p><strong>Temperature: </strong> ${temp}°C</p>
        <p><strong>Condition: </strong> ${condition}</p>
      `;
    })
    .catch(error => {
      console.error("Fetch error:", error); // ✅ Debug
      weatherDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
});
