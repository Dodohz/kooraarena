import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});

export default api;
