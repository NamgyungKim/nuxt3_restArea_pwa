<template>
  <div class="filter_toggle">
    <q-btn-toggle
      v-model="direction"
      color="primary"
      text-color="white"
      toggle-color="white"
      toggle-text-color="black"
      unelevated
      rounded
      :options="[
        { label: 'All', value: '2' },
        { label: '상향', value: '0' },
        { label: '하향', value: '1' },
      ]"
    />
  </div>
</template>

<script setup>
import { useFilter } from '~/stores/Filter';

const filter = useFilter();
const direction = ref('2');

watch(direction, () => {
  filter.SET_filterDirection(direction.value);
});
</script>

<style scoped>
.filter_toggle {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
}
</style>
