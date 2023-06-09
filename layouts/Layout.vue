<template>
  <div>
    <SideBar />
    <FilterToggle />
    <slot />
  </div>
</template>
<script setup>
import SideBar from '~/components/SideBar.vue';
import FilterToggle from '~/components/FilterToggle.vue';
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin';
</style>
