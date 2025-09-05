// src/hooks/useCountry.js
import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    setLoading(true)
    setError(null)

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry({
          found: true,
          data: response.data
        })
        setLoading(false)
      })
      .catch(error => {
        if (error.response?.status === 404) {
          setCountry({ found: false })
        } else {
          setError(error.message)
        }
        setLoading(false)
      })
  }, [name])

  return { country, loading, error }
}