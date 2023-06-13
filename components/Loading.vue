<template>
  <div class="loading">
    <q-spinner-hourglass color="black" size="5em" />
    <p>
      {{ text }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '로딩중',
  },
});
</script>

<style scoped lang="scss">
.loading {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100000;
  text-align: center;
  p {
    margin-top: 10px;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
