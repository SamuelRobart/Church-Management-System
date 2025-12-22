const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const WS_URL = process.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'

// Docker 
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090/api'
// const WS_URL = process.NEXT_PUBLIC_WS_URL || 'ws://localhost:9090'

export const api = {
  getWebSocketUrl: () => `${WS_URL}/chat`,
  
  auth: {
    register: (data) => fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    
    sendVerificationCode: (email) => fetch(`${API_URL}/auth/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(res => res.json()),

    verifyEmail: (email, code) => fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    }).then(res => res.json()),

    reSendVerificationCode: (email) => fetch(`${API_URL}auth/email/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(res => res.json()),
    
    login: (username, password) => fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(res => res.json()),
    
    logout: () => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return Promise.resolve()
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    },
    
    getToken: () => localStorage.getItem('authToken')
  },
  
  users: {
    count: () => fetch(`${API_URL}/users/count`).then(res => res.json()),
    getAll: () => fetch(`${API_URL}/users/getAllUser`).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id, data) => fetch(`${API_URL}/users/create/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_URL}/users/create/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },
  
  events: {
    getAll: () => fetch(`${API_URL}/events`).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/events/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id, data) => fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },
  
  messages: {
    getAll: () => fetch(`${API_URL}/messages`).then(res => res.json())
  },
  
}
