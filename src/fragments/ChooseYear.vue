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

const picker = ref([]);

props.bills.forEach(bill => bill.show && (bill.show = false));
search([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], Number(useDateFormat(useNow(), "YYYY").value));

function search(storage: number[], year: number) {
  for (let index = 0; index < props.bills.length; index++) {
    const mont = storage.find(el => el == props.bills[index].month);
    const bill = props.bills.find(el => el.month == mont && el.year == year);
    bill && (bill.show = true);
  }
}

function change(val: any) {
  const sDate = useDateFormat(val[0], "YYYY-MM").value.split("-");
  const sYear = Number(sDate[0]);
  const sMonth = Number(sDate[1]);
  const eDate = useDateFormat(val[1], "YYYY-MM").value.split("-");
  const eYear = Number(eDate[0]);
  const eMonth = Number(eDate[1]);
  const sStore: number[] = [];
  const eStore: number[] = [];

  props.bills.forEach(bill => bill.show && (bill.show = false));

  if (sYear === eYear) {
    for (let i = sMonth; i <= eMonth; i++) sStore.push(i);
    search(sStore, sYear);
  } else {
    for (let i = sMonth; i <= 12; i++) sStore.push(i);
    for (let i = 1; i <= eMonth; i++) eStore.push(i);
    search(sStore, sYear);
    search(eStore, eYear);
  }
}
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
