const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");

const BACKEND_URL = "https://weather-api-proxy-8dzt.vercel.app/api/weather";

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (city === "") return;

  console.log("Searching for:", city);

  fetch(`${BACKEND_URL}?city=${encodeURIComponent(city)}`)
    .then(response => {
      console.log("Response received:", response.status);
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      console.log("Data received:", data);

      const temp = data.current?.temp_c ?? "N/A";
      const condition = data.current?.condition?.text ?? "Unknown";
      const icon = data.current?.condition?.icon ?? "";
      const location = `${data.location?.name ?? "Unknown"}, ${data.location?.country ?? ""}`;

      weatherDiv.innerHTML = `
        <h2>${location}</h2>
        <img src="${icon.startsWith('//') ? 'https:' + icon : icon}" alt="${condition}" />
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Condition:</strong> ${condition}</p>
      `;
      
      weatherDiv.style.display = "inline-block";

      console.log("Final icon URL:", icon);
      console.log("HTML injected into #weather");
    })
    .catch(error => {
      console.error("Error occurred:", error.message);
      weatherDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
});
