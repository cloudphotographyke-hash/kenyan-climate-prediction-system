// frontend/src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API calls with logging
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`API Call: ${options?.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API Response ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API Error ${endpoint}:`, error);
    throw error;
  }
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

// Climate API with enhanced error handling
export const climateApi = {
  getENSOCurrent: async () => {
    return apiCall('/api/climate/enso/current');
  },
  
  getENSOHistory: async (years: number = 10) => {
    return apiCall(`/api/climate/enso/history?years=${years}`);
  },
  
  getENSOImpact: async (location: string) => {
    const response = await apiCall(`/api/climate/enso/impact/${encodeURIComponent(location)}`);
    console.log('ENSO Impact - raw response:', response);
    
    // Ensure we return a consistent structure
    if (response && typeof response === 'object') {
      return response;
    }
    return { risk_assessment: null };
  },
  
  getSeasonalOutlook: async (location: string) => {
    return apiCall(`/api/climate/seasonal/${encodeURIComponent(location)}`);
  },
  
  getAnomalies: async (location: string, period: string = '1y') => {
    return apiCall(`/api/climate/anomalies/${encodeURIComponent(location)}?period=${period}`);
  }
};

// Predictions API with data validation
export const predictionsApi = {
  getRainfall: async (location: string, months: number = 3) => {
    const data = await apiCall(`/api/predictions/rainfall/${encodeURIComponent(location)}?months=${months}`);
    console.log('Rainfall prediction data:', data);
    
    // Validate and ensure monthly_breakdown exists
    if (!data || !data.monthly_breakdown) {
      console.warn('Rainfall data missing monthly_breakdown, using fallback');
      return {
        monthly_breakdown: Array(months).fill(null).map((_, i) => ({
          month: new Date().getMonth() + i + 1,
          predicted_mm: 0,
          confidence: 0.5
        })),
        total_predicted_mm: 0,
        confidence_score: 0.5
      };
    }
    return data;
  },
  
  getDrought: (location: string) => 
    apiCall(`/api/predictions/drought/${encodeURIComponent(location)}`),
  
  getFlood: (location: string) => 
    apiCall(`/api/predictions/flood/${encodeURIComponent(location)}`),
  
  getTemperature: async (location: string, months: number = 3) => {
    const data = await apiCall(`/api/predictions/temperature/${encodeURIComponent(location)}?months=${months}`);
    console.log('Temperature prediction data:', data);
    
    // Validate and ensure monthly_breakdown exists
    if (!data || !data.monthly_breakdown) {
      console.warn('Temperature data missing monthly_breakdown, using fallback');
      return {
        monthly_breakdown: Array(months).fill(null).map((_, i) => ({
          month: new Date().getMonth() + i + 1,
          predicted_temp_c: 20,
          anomaly_c: 0,
          confidence: 0.5
        })),
        average_predicted_temp_c: 20,
        confidence_score: 0.5
      };
    }
    return data;
  },
  
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

// Analytics API
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