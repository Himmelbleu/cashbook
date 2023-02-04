<script setup lang="ts">
import { PropType } from "vue";
import { useNow, useDateFormat } from "@vueuse/core";
import { Bill } from "../types/data-type";

const props = defineProps({
  bills: {
    type: Object as PropType<Bill[]>,
    required: true
  }
});

const picker = ref([new Date(new Date().setMonth(0)), new Date(new Date().setMonth(11))]);

function change(val: any) {}
</script>

<template>
  <div>
    <el-date-picker
      v-model="picker"
      @change="change"
      type="monthrange"
      range-separator="To"
      start-placeholder="start month"
      end-placeholder="end month" />
  </div>
</template>

<style scoped lang="scss"></style>
