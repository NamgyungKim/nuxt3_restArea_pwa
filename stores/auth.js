import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', {
  state: () => ({
    auth: false,
  }),
  getters: {
    getAuth(state) {
      return state.auth;
    },
  },
  actions: {
    login() {
      this.auth = true;
    },
    logout() {
      this.auth = false;
    },
  },
});
