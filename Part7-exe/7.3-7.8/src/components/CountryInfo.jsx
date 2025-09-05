// src/components/CountryInfo.jsx
import { useState } from 'react'
import { useCountry } from '../hooks/useCountry'

const CountryInfo = () => {
  const [name, setName] = useState('')
  const { country, loading, error } = useCountry(name)

  const handleSubmit = (e) => {
    e.preventDefault()
    // The search is triggered by the useEffect in useCountry hook
  }

  return (
    <div>
      <h2>Find Country</h2>
      <form onSubmit={handleSubmit}>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter country name"
        />
        <button type="submit">find</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {country && (
        <div>
          {country.found ? (
            <div>
              <h3>{country.data.name.common}</h3>
              <p>capital {country.data.capital[0]}</p>
              <p>population {country.data.population}</p>
              <img 
                src={country.data.flags.png} 
                alt={`Flag of ${country.data.name.common}`} 
                style={{ width: '100px' }}
              />
            </div>
          ) : (
            <p>not found...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CountryInfo