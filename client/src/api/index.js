import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const shortenUrl = (originalUrl, customAlias) =>
  api.post('/shorten', { originalUrl, customAlias }).then(r => r.data);