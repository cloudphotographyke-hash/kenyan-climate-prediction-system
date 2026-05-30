"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Droplets, Flame, Waves, Shield } from 'lucide-react'
import { climateApi } from '@/lib/api'

interface RiskData {
  overall_risk: string
  risk_score: number
  detailed_risks: Array<{
    type: string
    risk_level: string
    description: string
    affected_seasons?: string[]
    confidence: number
  }>
  recommendations?: string[]
}

export default function RiskAssessment({ location }: { location: string }) {
  const [risk, setRisk] = useState<RiskData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRisk = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await climateApi.getENSOImpact(location)
        console.log('Raw API response in RiskAssessment:', response)
        
        // Default risk data in case we can't extract it
        let riskData: RiskData = {
          overall_risk: "Low",
          risk_score: 20,
          detailed_risks: [],
          recommendations: ["Check back later for updated risk assessment"]
        }
        
        // Try to extract risk_assessment from various response structures
        if (response) {
          if (response.risk_assessment) {
            riskData = response.risk_assessment
            console.log('Found risk_assessment in response')
          } else if (response.data && response.data.risk_assessment) {
            riskData = response.data.risk_assessment
            console.log('Found risk_assessment in response.data')
          } else if (response.overall_risk) {
            riskData = response as RiskData
            console.log('Response itself is the risk assessment')
          } else {
            console.warn('Unknown response structure:', response)
          }
        }
        
        setRisk(riskData)
      } catch (error) {
        console.error('Risk fetch error:', error)
        setError('Failed to load risk assessment')
        // Set default data so UI doesn't crash
        setRisk({
          overall_risk: "Medium",
          risk_score: 25,
          detailed_risks: [],
          recommendations: ["Unable to load risk data. Please refresh the page."]
        })
      } finally {
        setLoading(false)
      }
    }

    if (location) {
      fetchRisk()
    }
  }, [location])

  if (loading) {
    return (
      <div className="climate-card animate-pulse">
        <div className="h-48 bg-slate-700 rounded-lg"></div>
      </div>
    )
  }

  if (error && !risk) {
    return (
      <div className="climate-card">
        <div className="text-red-400 text-center py-8">{error}</div>
      </div>
    )
  }

  if (!risk) return null

  const getRiskColor = (level: string) => {
    const lvl = level?.toLowerCase() || 'low'
    switch (lvl) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'medium-high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-green-400 bg-green-400/10 border-green-400/20'
    }
  }

  const getRiskIcon = (type: string) => {
    const t = type?.toLowerCase() || ''
    if (t.includes('drought')) return <Flame className="w-5 h-5" />
    if (t.includes('rainfall')) return <Droplets className="w-5 h-5" />
    if (t.includes('flood')) return <Waves className="w-5 h-5" />
    return <AlertTriangle className="w-5 h-5" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="climate-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-climate-green" />
          <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk.overall_risk)}`}>
          {risk.overall_risk || 'Unknown'} Risk
        </div>
      </div>

      {/* Risk Score Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">Risk Score</span>
          <span className="text-white font-medium">{risk.risk_score || 0}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${risk.risk_score || 0}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              (risk.risk_score || 0) > 70 ? 'bg-red-400' : 
              (risk.risk_score || 0) > 40 ? 'bg-yellow-400' : 'bg-green-400'
            }`}
          />
        </div>
      </div>

      {/* Detailed Risks */}
      {risk.detailed_risks && risk.detailed_risks.length > 0 && (
        <div className="space-y-3 mb-4">
          {risk.detailed_risks.map((r, i) => (
            <div key={i} className={`p-3 rounded-lg border ${getRiskColor(r.risk_level)}`}>
              <div className="flex items-center gap-2 mb-1">
                {getRiskIcon(r.type)}
                <span className="text-sm font-medium capitalize">{r.type?.replace('_', ' ') || 'Risk'}</span>
                <span className="text-xs opacity-70 ml-auto">{(r.confidence * 100).toFixed(0)}% confidence</span>
              </div>
              <p className="text-xs opacity-80">{r.description || 'No description available'}</p>
              {r.affected_seasons && r.affected_seasons.length > 0 && (
                <p className="text-xs opacity-60 mt-1">Affected: {r.affected_seasons.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {risk.recommendations && risk.recommendations.length > 0 && (
        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm font-medium text-white mb-2">Recommendations</p>
          <ul className="space-y-1">
            {risk.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-climate-green mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}