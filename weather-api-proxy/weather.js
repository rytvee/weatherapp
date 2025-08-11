export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access from any origin (for GitHub Pages)

  const API_KEY = process.env.WEATHER_API_KEY;
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
