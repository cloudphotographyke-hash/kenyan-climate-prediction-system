// frontend/src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Weather API
export const weatherApi = {
  getCurrent: (location: string) => 
    apiCall(`/api/weather/current/${encodeURIComponent(location)}`),
  
  getForecast: (location: string, days: number = 7) => 
    apiCall(`/api/weather/forecast/${encodeURIComponent(location)}?days=${days}`),
  
  getHistorical: (location: string, startDate: string, endDate: string) => 
    apiCall(`/api/weather/historical/${encodeURIComponent(location)}?start_date=${startDate}&end_date=${endDate}`)
};

// Climate API
export const climateApi = {
  getENSOCurrent: () => 
    apiCall('/api/climate/enso/current'),
  
  getENSOHistory: (years: number = 10) => 
    apiCall(`/api/climate/enso/history?years=${years}`),
  
  getENSOImpact: (location: string) => 
    apiCall(`/api/climate/enso/impact/${encodeURIComponent(location)}`),
  
  getSeasonalOutlook: (location: string) => 
    apiCall(`/api/climate/seasonal/${encodeURIComponent(location)}`),
  
  getAnomalies: (location: string, period: string = '1y') => 
    apiCall(`/api/climate/anomalies/${encodeURIComponent(location)}?period=${period}`)
};

// Predictions API
export const predictionsApi = {
  getRainfall: (location: string, months: number = 3) => 
    apiCall(`/api/predictions/rainfall/${encodeURIComponent(location)}?months=${months}`),
  
  getDrought: (location: string) => 
    apiCall(`/api/predictions/drought/${encodeURIComponent(location)}`),
  
  getFlood: (location: string) => 
    apiCall(`/api/predictions/flood/${encodeURIComponent(location)}`),
  
  getTemperature: (location: string, months: number = 3) => 
    apiCall(`/api/predictions/temperature/${encodeURIComponent(location)}?months=${months}`),
  
  getComprehensive: (location: string) => 
    apiCall(`/api/predictions/comprehensive/${encodeURIComponent(location)}`),
  
  retrainModels: () => 
    apiCall('/api/predictions/retrain', { method: 'POST' })
};

// Locations API
export const locationsApi = {
  search: (query: string, limit: number = 10) => 
    apiCall(`/api/locations/search?q=${encodeURIComponent(query)}&limit=${limit}`),
  
  getAll: () => 
    apiCall('/api/locations/all'),
  
  getRegions: () => 
    apiCall('/api/locations/regions'),
  
  getDetails: (location: string) => 
    apiCall(`/api/locations/${encodeURIComponent(location)}`)
};

// Alerts API
export const alertsApi = {
  getActive: (location?: string) => 
    apiCall(`/api/alerts/active${location ? `?location=${encodeURIComponent(location)}` : ''}`),
  
  getHistory: (location: string) => 
    apiCall(`/api/alerts/history/${encodeURIComponent(location)}`),
  
  subscribe: (email: string, location: string) => 
    apiCall('/api/alerts/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, location })
    })
};

// Analytics API (if needed)
export const analyticsApi = {
  getDashboard: () => 
    apiCall('/api/analytics/dashboard'),
  
  getTrends: (location: string, metric: string) => 
    apiCall(`/api/analytics/trends?location=${encodeURIComponent(location)}&metric=${metric}`),
  
  getPopular: () => 
    apiCall('/api/analytics/popular')
};

// Default export for convenience
const api = {
  weatherApi,
  climateApi,
  predictionsApi,
  locationsApi,
  alertsApi,
  analyticsApi
};

export default api;