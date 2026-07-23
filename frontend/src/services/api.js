import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pgas_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pgas_token')
      localStorage.removeItem('pgas_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

// ─── Departments ──────────────────────────────────────
export const departmentAPI = {
  getAll: (params) => api.get('/departments', { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
}

// ─── Employees ────────────────────────────────────────
export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
}

// ─── Spendings ────────────────────────────────────────
export const spendingAPI = {
  getAll: (params) => api.get('/spendings', { params }),
  getById: (id) => api.get(`/spendings/${id}`),
  create: (data) => api.post('/spendings', data),
  update: (id, data) => api.put(`/spendings/${id}`, data),
  delete: (id) => api.delete(`/spendings/${id}`),
}

// ─── Reports ──────────────────────────────────────────
export const reportAPI = {
  getSpendings: (params) => api.get('/reports/spendings', { params }),
  getMetadata: () => api.get('/reports/metadata'),
  exportExcel: (params) => api.get('/reports/spendings/export/excel', { params, responseType: 'blob' }),
  exportPdf: (params) => api.get('/reports/spendings/export/pdf', { params, responseType: 'blob' }),
  getPowerBi: () => api.get('/reports/power-bi'),
}

export default api
