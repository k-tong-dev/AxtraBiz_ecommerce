// hooks/useCountryDetect.ts
import { useState, useEffect } from 'react'

export function useCountryDetect() {
  const [country, setCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => setCountry(data.country_code))
        .catch(() => setCountry(null))
        .finally(() => setLoading(false))
  }, [])

  return { country, loading }
}