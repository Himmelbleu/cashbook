<script setup lang="ts">
import { PropType } from "vue";
import { useStorage } from "@vueuse/core";
import { Bill } from "../types/data-type";

const props = defineProps({
  bill: {
    type: Object as PropType<Bill>,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const bills = useStorage<Bill[]>("bills", []);

function confirm() {
  bills.value.splice(props.index, 1);
  ElMessage({
    type: "success",
    message: "删除成功！"
  });
}
</script>

<template>
  <div>
    <el-popconfirm @confirm="confirm" confirm-button-text="确定" cancel-button-text="取消" title="确定删除该账单？">
      <template #reference>
        <el-button @click="" size="small" type="primary" text>删除账单</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<style scoped lang="scss"></style>
