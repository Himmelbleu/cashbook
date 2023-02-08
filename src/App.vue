<script setup lang="ts">
import { useStorage } from "@vueuse/core";
const cabinetVal = useStorage<any>("cabinet", {});

const show = ref(false);
</script>

<template>
  <div class="header f-c-b">
    <TextIcon icon="operation" @click="show = !show" :icon-size="2" :text-size="1" />
    <div class="fsz-1.4">{{ cabinetVal.name }} 的账本</div>
  </div>
  <Main />
  <div class="cabinet absolute top-0 left-0" :class="{ 'z-99': show, 'z--1': !show }">
    <div class="relative">
      <div class="content bg p-4 w-60vw absolute top-0 left-0" :class="{ bg: show }">
        <Cabinet />
      </div>
      <div @click="show = !show" class="modal w-40vw absolute top-0 left-60vw"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cabinet .content,
.cabinet .modal {
  height: 100vh;
}

.cabinet .modal {
  background-color: rgba(30, 30, 30, 0.5);
}
</style>
