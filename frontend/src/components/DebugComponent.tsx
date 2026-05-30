"use client"

import { useEffect, useState } from 'react'
import { climateApi, predictionsApi } from '@/lib/api'

export default function DebugComponent({ location }: { location: string }) {
  const [ensoData, setEnsoData] = useState<any>(null)
  const [rainfallData, setRainfallData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function debug() {
      console.log('=== DEBUGGING API CALLS ===')
      console.log('Location:', location)
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
      
      try {
        console.log('Fetching ENSO impact...')
        const enso = await climateApi.getENSOImpact(location)
        console.log('ENSO Impact Response:', enso)
        setEnsoData(enso)
      } catch (err) {
        console.error('ENSO Error:', err)
        setError(String(err))
      }
      
      try {
        console.log('Fetching rainfall...')
        const rainfall = await predictionsApi.getRainfall(location, 6)
        console.log('Rainfall Response:', rainfall)
        setRainfallData(rainfall)
      } catch (err) {
        console.error('Rainfall Error:', err)
      }
    }
    
    debug()
  }, [location])

  return (
    <div className="climate-card mb-4">
      <h3 className="text-white font-bold mb-2">Debug Information</h3>
      {error && <div className="text-red-400 text-sm">Error: {error}</div>}
      <div className="text-xs text-slate-300">
        <div>API URL: {process.env.NEXT_PUBLIC_API_URL}</div>
        <div>Location: {location}</div>
        {ensoData && (
          <details>
            <summary>ENSO Response (click to expand)</summary>
            <pre className="mt-2 p-2 bg-slate-800 rounded overflow-auto max-h-48">
              {JSON.stringify(ensoData, null, 2)}
            </pre>
          </details>
        )}
        {rainfallData && (
          <details>
            <summary>Rainfall Response (click to expand)</summary>
            <pre className="mt-2 p-2 bg-slate-800 rounded overflow-auto max-h-48">
              {JSON.stringify(rainfallData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
