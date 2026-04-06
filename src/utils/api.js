import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ssea_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ssea_token')
      localStorage.removeItem('ssea_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
