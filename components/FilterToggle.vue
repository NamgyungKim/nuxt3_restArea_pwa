<template>
  <div class="filter_toggle">
    <div class="q-gutter-sm">
      <q-radio v-model="option" keep-color dark val="rest" label="휴게소" color="primary" />
      <q-radio v-model="option" keep-color dark val="elec" label="전기차 충전소" color="primary" />
    </div>
    <q-btn-toggle
      v-if="option === 'rest'"
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
const option = ref('rest');

watch(direction, () => {
  filter.SET_filterDirection(direction.value);
});
watch(option, () => {
  if (option.value === 'elec') {
    direction.value = '3';
  } else {
    direction.value = '2';
  }
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
