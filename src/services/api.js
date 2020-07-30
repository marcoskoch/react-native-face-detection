import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.kairos.com',
  headers: {
    'Content-Type': 'application/json',
    app_id: 'd636e79b',
    app_key: 'ffca900ae853c5775b30f1565e62cf6d',
  },
});

export default api;
