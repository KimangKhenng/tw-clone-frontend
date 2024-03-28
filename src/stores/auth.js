import { defineStore } from 'pinia'
import axios from "axios"

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        loggedUser: {}
    }),
    actions: {
        async login(email, password) {
            try {
                const { data } = await axios.post('/api/auth/login', {
                    email: email,
                    password: password
                })
                this.token = data.token
                const response = await axios.get('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                })
                this.loggedUser = response.data.user
            } catch (e) {
                console.log(e)
            }
        },
        async googleLogin(code) {
            try {
                const { data } = await axios.get(`/api/auth/google?code=${code}`)
                this.token = data.token
                const response = await axios.get('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                })
                this.loggedUser = response.data.user
            } catch (e) {
                console.log(e)
            }
        },
        logout() {
            this.token = ''
            this.loggedUser = {}
        }
    },
    getters: {
        isAuthenticated() {
            return this.token !== ''
        },
        getToken() {
            return this.token
        }
    }
})