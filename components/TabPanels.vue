<template>
  <div>
    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
      <q-tab v-for="(item, i) in props.tabMenu" :key="i" :name="item" :label="item" />
    </q-tabs>

    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <slot />
      <!--      <q-tab-panel v-for="(item, i) in tabMenu" :key="i" :name="item">-->
      <!--        <div class="text-h6">Mails</div>-->
      <!--        Lorem ipsum dolor sit amet consectetur adipisicing elit.-->
      <!--      </q-tab-panel>-->
    </q-tab-panels>
  </div>
</template>

<script setup>
const tab = ref(props.tabMenu[0]);
const props = defineProps({
  tabMenu: { type: Array, default: [] },
});
</script>

<style scoped></style>
