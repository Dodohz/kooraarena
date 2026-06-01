import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const API_BASE_URL = 'https://v3.football.api-sports.io'

if (!API_KEY) {
  console.error('API Key is not set. Please add VITE_API_KEY to your environment variables.')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
})

export default api
