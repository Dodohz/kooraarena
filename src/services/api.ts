import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const API_BASE_URL = 'https://v3.football.api-sports.io'

if (!API_KEY) {
  console.warn('⚠️ API Key is not set. Please add VITE_API_KEY to your environment variables.')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
  timeout: 10000,
})

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  return config
})

// Helper to get date string YYYY-MM-DD
export function getDateString(offset: number = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

export default api
