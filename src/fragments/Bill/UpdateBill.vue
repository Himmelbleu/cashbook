<script setup lang="ts">
import { PropType } from "vue";
import { Coin } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { Bill } from "../../types/data-type";
import { validateMoney, onSubmit } from "../../helpers/form-helper";

const props = defineProps({
  cashbook: {
    type: Object as PropType<Bill>,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const dialog = ref(false);
const form = reactive({
  total: props.cashbook[props.year][props.month].total
});
const rule = reactive<FormRules>({
  total: [{ validator: validateMoney, trigger: "change" }]
});
const formInst = ref<FormInstance>();

function onSubmitPass() {
  props.cashbook[props.year][props.month].total = form.total;
  dialog.value = !dialog.value;
  ElMessage({
    type: "success",
    message: "更新成功！"
  });
}

function onSubmitError() {
  ElMessage({
    type: "success",
    message: "更新失败，检查输入的值是否正确！"
  });
}
</script>

<template>
  <div>
    <el-button text type="primary" size="small" @click="dialog = !dialog">修改账单</el-button>
    <el-dialog v-model="dialog" title="创建账单" width="90%">
      <div class="mb-6">当前修改的账单对应的月份：{{ month }}</div>
      <el-form ref="formInst" :model="form" :rules="rule" label-position="left">
        <el-form-item label="本月总预算" prop="total">
          <el-input type="number" clearable :prefix-icon="Coin" v-model="form.total" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formInst, onSubmitPass, onSubmitError)">更新</el-button>
          <el-button @click="dialog = !dialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
