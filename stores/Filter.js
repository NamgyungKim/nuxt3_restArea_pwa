import { defineStore } from 'pinia';

export const useFilter = defineStore('filter', {
  state: () => ({
    filterDirection: '2',
  }),
  getters: {
    getFilterDirection: (state) => state.filterDirection,
  },
  actions: {
    SET_filterDirection(direction) {
      this.filterDirection = direction;
    },
  },
});
