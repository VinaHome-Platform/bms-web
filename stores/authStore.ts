import { defineStore } from 'pinia'
import type { AuthStoreType } from '~/types/authType'

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreType => {
    if (import.meta.client) {
      const saved = localStorage.getItem('auth_store')
      if (saved) return JSON.parse(saved)
    }

    return {
      access_token: '',
      refresh_token: '',
      expires_in: 0,
      id: '',
      username: '',
      full_name: '',
      company_id: 0,
      role: ''
    }
  },

  actions: {
    setAuthData(data: AuthStoreType) {
      this.access_token = data.access_token
      this.refresh_token = data.refresh_token
      this.expires_in = data.expires_in
      this.id = data.id
      this.username = data.username
      this.full_name = data.full_name
      this.company_id = data.company_id
      this.role = data.role

      if (import.meta.client) {
        localStorage.setItem('auth_store', JSON.stringify(data))
      }
    },

    clearAuthData() {
      this.access_token = ''
      this.refresh_token = ''
      this.expires_in = 0
      this.id = ''
      this.username = ''
      this.full_name = ''
      this.company_id = 0
      this.role = ''
      if (import.meta.client) {
        localStorage.removeItem('auth_store')
      }
    }
  }
})
