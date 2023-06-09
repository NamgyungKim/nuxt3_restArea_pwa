<template>
  <div>
    <SideBar />
    <slot />
  </div>
</template>
<script setup>
import SideBar from '~/components/SideBar.vue';
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin';
</style>
