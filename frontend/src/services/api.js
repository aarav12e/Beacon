import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('beacon_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('beacon_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
  update:   (data) => api.put('/auth/profile', data),
};

// ─── Stocks ───────────────────────────────────────────────────────────────────
export const stocksAPI = {
  marketSummary: ()                   => api.get('/stocks/market-summary'),
  movers:        ()                   => api.get('/stocks/movers'),
  search:        (q)                  => api.get('/stocks/search', { params: { q } }),
  quote:         (symbol, exchange)   => api.get(`/stocks/quote/${symbol}`, { params: { exchange } }),
  history:       (symbol, period, exchange) => api.get(`/stocks/history/${symbol}`, { params: { period, exchange } }),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiAPI = {
  chat:               (data) => api.post('/ai/chat', data),
  analyzeStock:       (data) => api.post('/ai/analyze-stock', data),
  summarizeStatement: (data) => api.post('/ai/summarize-statement', data),
  summarizeCircular:  (data) => api.post('/ai/summarize-circular', data),
  macroOutlook:       (data) => api.post('/ai/macro-outlook', data),
};

// ─── Research ─────────────────────────────────────────────────────────────────
export const researchAPI = {
  getAll:  (params) => api.get('/research', { params }),
  getOne:  (id)     => api.get(`/research/${id}`),
  create:  (data)   => api.post('/research', data),
  update:  (id, data) => api.put(`/research/${id}`, data),
  delete:  (id)     => api.delete(`/research/${id}`),
};

// ─── Watchlist ────────────────────────────────────────────────────────────────
export const watchlistAPI = {
  getAll:      ()          => api.get('/watchlist'),
  create:      (data)      => api.post('/watchlist', data),
  addStock:    (id, data)  => api.put(`/watchlist/${id}/add-stock`, data),
  removeStock: (id, data)  => api.put(`/watchlist/${id}/remove-stock`, data),
  delete:      (id)        => api.delete(`/watchlist/${id}`),
};

// ─── Circulars ────────────────────────────────────────────────────────────────
export const circularsAPI = {
  getAll: (params) => api.get('/circulars', { params }),
};

// ─── Excel ────────────────────────────────────────────────────────────────────
export const excelAPI = {
  analyze:       (formData) => api.post('/excel/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }),
  formulaAssist: (data)     => api.post('/excel/formula-assist', data),
};

export default api;
