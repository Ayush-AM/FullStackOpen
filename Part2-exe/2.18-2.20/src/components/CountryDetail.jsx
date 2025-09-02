import { useEffect, useState } from "react"
import weatherService from "../services/weather"

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const capital = country.capital[0]

  useEffect(() => {
    weatherService.getWeather(capital).then(setWeather).catch(console.error)
  }, [capital])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(l => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" width="150" />

      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default CountryDetail
