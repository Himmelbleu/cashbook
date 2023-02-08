<script setup lang="ts">
import { PropType } from "vue";
import { Bill } from "../../types/data-type";

const props = defineProps({
  cashbook: {
    type: Object as PropType<Bill>,
    required: true
  }
});

const years = Object.keys(props.cashbook).map(x => {
  return { value: x, label: `${x} 年` };
});
const options = ref(years);
const selYear = ref(years[0]?.value);

const emits = defineEmits(["change"]);

function change() {
  emits("change", selYear.value);
}
</script>

<template>
  <div>
    <el-select @change="change" v-model="selYear" class="m-2" placeholder="Select">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<style scoped lang="scss"></style>
