<script setup lang="ts">
import { PropType } from "vue";
import { ICashbook } from "../../types/data-type";

const props = defineProps({
  cashbook: {
    type: Object as PropType<ICashbook>,
    required: true
  },
  nowYear: {
    type: String,
    required: true
  },
  nowMonth: {
    type: String,
    required: true
  },
  outlayIndex: {
    type: Number,
    required: true
  }
});

function confirm() {
  props.cashbook[props.nowYear][props.nowMonth].outlays?.splice(props.outlayIndex, 1);
  ElMessage({
    type: "success",
    message: "删除成功！"
  });
}
</script>

<template>
  <div>
    <el-popconfirm
      @confirm="confirm"
      confirm-button-text="确定"
      cancel-button-text="取消"
      title="确定删除该支出项？">
      <template #reference>
        <el-button @click="" size="small" type="primary" text>删除支出</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<style scoped lang="scss"></style>
