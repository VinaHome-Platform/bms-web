import { defineStore } from 'pinia'
import type { UserInfoType } from '~/types/accountType'

const LOCAL_KEY = 'user_info'

export const useAuthStore = defineStore('auth', {
  state: (): UserInfoType => ({
    id: '',
    username: '',
    full_name: '',
    company_id: 0,
    role: '',
    refresh_token: '',
    expires_in: 0,
  }),

  actions: {
    setUserInfo(user: UserInfoType) {
      this.id = user.id
      this.username = user.username
      this.full_name = user.full_name
      this.company_id = user.company_id
      this.role = user.role
      this.refresh_token = user.refresh_token
      this.expires_in = user.expires_in

      if (import.meta.client) {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(user))
      }
    },

    loadUserInfo() {
      if (import.meta.client) {
        const saved = localStorage.getItem(LOCAL_KEY)
        if (saved) {
          const user = JSON.parse(saved)
          this.setUserInfo(user)
        } else {
            navigateTo('/')
        }
      }
    },

    resetUserInfo() {
      this.id = ''
      this.username = ''
      this.full_name = ''
      this.company_id = 0
      this.role = ''
      this.refresh_token = ''
      this.expires_in = 0

      if (import.meta.client) {
        localStorage.removeItem(LOCAL_KEY)
      }
    }
  }
})
