<script setup lang="ts">
import { PropType } from "vue";
import { useDateFormat } from "@vueuse/core";
import { Bill } from "../types/data-type";

const props = defineProps({
  bills: {
    type: Object as PropType<Bill[]>,
    required: true
  }
});

const datePickerData = ref();

function change(val: any) {
  const startDate = useDateFormat(val[0], "YYYY-MM").value.split("-");
  const startYear = Number(startDate[0]);
  const startMonth = Number(startDate[1]);
  const endDate = useDateFormat(val[1], "YYYY-MM").value.split("-");
  const endYear = Number(endDate[0]);
  const endMonth = Number(endDate[1]);
  let seldMons: any[] = [];

  if (startYear === endYear) {
    for (let i = startMonth; i <= endMonth; i++) seldMons.push(i);
    props.bills.forEach(bill => bill.show && (bill.show = false));
    for (let index = 0; index < props.bills.length; index++) {
      const mon = seldMons.find(ele => ele == props.bills[index].month);
      const bill = props.bills.find(ele => ele.month == mon);
      bill && (bill.show = true);
    }
  } else {
    for (let i = endMonth; i <= 12; i++) {
      seldMons.push(i);
    }
    for (let i = 1; i <= endMonth; i++) {
      seldMons.push(i);
    }
  }
}
</script>

<template>
  <div>
    <el-date-picker
      v-model="datePickerData"
      @change="change"
      type="monthrange"
      range-separator="To"
      start-placeholder="start month"
      end-placeholder="end month" />
  </div>
</template>

<style scoped lang="scss"></style>
