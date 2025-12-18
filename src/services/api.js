const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090/api'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:9090'

export const api = {
  getWebSocketUrl: () => `${WS_URL}/chat`,
  users: {
    count: () => fetch(`${API_URL}/users/count`).then(res => res.json()),
    getAll: () => fetch(`${API_URL}/users/getAllUser`).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    update: (id, data) => fetch(`${API_URL}/users/create/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id) => fetch(`${API_URL}/users/create/${id}`, {
      method: 'DELETE'
    })
  },
  events: {
    getAll: () => fetch(`${API_URL}/events`).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/events/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    update: (id, data) => fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id) => fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE'
    })
  },
  messages: {
    getAll: () => fetch(`${API_URL}/messages`).then(res => res.json())
  }
}
