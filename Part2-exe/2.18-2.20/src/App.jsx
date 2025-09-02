import { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(res => setCountries(res.data))
  }, [])

useEffect(() => {
  if (selected && selected.capital) {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${selected.capital[0]}&appid=${api_key}&units=metric`)
      .then(res => setWeather(res.data))
      .catch(err => console.error("Weather fetch error:", err))
  }
}, [selected, api_key])


  const handleFilter = (e) => {
    setFilter(e.target.value)
    setSelected(null)
    setWeather(null)
  }

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Find Countries</h1>
      <input value={filter} onChange={handleFilter} />

      {selected ? (
        <div>
          <h2>{selected.name.common}</h2>
          <p>Capital: {selected.capital}</p>
          <p>Area: {selected.area}</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values(selected.languages || {}).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img src={selected.flags.png} alt="flag" width="150" />

          {weather && (
            <div>
              <h3>Weather in {selected.capital}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather"
              />
            </div>
          )}
        </div>
      ) : filtered.length === 1 ? (
        <button onClick={() => setSelected(filtered[0])}>
          Show {filtered[0].name.common}
        </button>
      ) : (
        <ul>
          {filtered.map(c => (
            <li key={c.cca3}>
              {c.name.common}{" "}
              <button onClick={() => setSelected(c)}>show</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
