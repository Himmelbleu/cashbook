<script setup lang="ts">
import { PropType } from "vue";
import { useStorage } from "@vueuse/core";
import { Outlay, Bill } from "../types/data-type";

const props = defineProps({
  bill: {
    type: Object as PropType<Bill>,
    required: true
  },
  outlay: {
    type: Object as PropType<Outlay>,
    required: true
  },
  billIndex: {
    type: Number,
    required: true
  },
  outlayIndex: {
    type: Number,
    required: true
  }
});

const bills = useStorage<Bill[]>("bills", []);

function confirm() {
  bills.value[props.billIndex].outlays?.splice(props.outlayIndex, 1);
  ElMessage({
    type: "success",
    message: "删除成功！"
  });
}
</script>

<template>
  <div>
    <el-popconfirm @confirm="confirm" confirm-button-text="确定" cancel-button-text="取消" title="确定删除该支出项？">
      <template #reference>
        <el-button @click="" size="small" type="primary" text>删除支出</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<style scoped lang="scss"></style>
