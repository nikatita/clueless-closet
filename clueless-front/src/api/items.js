import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const itemsApi = {
  getAll: (params) =>
    api.get('/items', { params }).then(r => r.data),

  getOne: (id) =>
    api.get(`/items/${id}`).then(r => r.data),

  create: (itemData, imageFile) => {
    const form = new FormData()
    form.append('item', new Blob([JSON.stringify(itemData)], {
      type: 'application/json'
    }))
    if (imageFile) form.append('image', imageFile)
    return api.post('/items', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data)
  },

  update: (id, itemData) =>
    api.put(`/items/${id}`, itemData).then(r => r.data),

  delete: (id) =>
    api.delete(`/items/${id}`),
}

export default api
