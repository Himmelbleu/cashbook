<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Coin } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { Bill } from "../types/data-type";
import { validateMoney, onSubmit } from "../helpers/form-helper";

const bills = useStorage<Bill[]>("bills", []);
const dialog = ref(false);
const formData = reactive(<Bill>{
  month: 1,
  total: 1000
});
const formRule = reactive<FormRules>({
  total: [{ validator: validateMoney, trigger: "change" }]
});
const formInst = ref<FormInstance>();

function onSubmitPass() {
  let isExistBill = true;

  if (bills.value.length) {
    bills.value.forEach(elem => {
      if (elem.month === formData.month) {
        isExistBill = false;
      }
    });
  }

  if (isExistBill) {
    bills.value.push(formData);
    dialog.value = !dialog.value;
    ElMessage({
      type: "success",
      message: "创建账单成功！"
    });
  } else {
    ElMessage({
      type: "error",
      message: "已有该月的账单，不要重复添加！"
    });
  }
}

function onSubmitError() {
  ElMessage({
    type: "error",
    message: "创建账单失败，检查输入的值是否正确！"
  });
}

let options = <any>[];
for (let i = 0; i < 12; i++) {
  options.push({
    value: i + 1,
    label: `${i + 1} 月`
  });
}
</script>

<template>
  <el-button @click="dialog = !dialog">创建账单</el-button>
  <el-dialog v-model="dialog" title="创建账单" width="90%">
    <div class="mb-6">当前创建的账单对应的月份：{{ formData.month }}</div>
    <el-form ref="formInst" :model="formData" :rules="formRule" label-position="left">
      <el-form-item label="账单的月份" prop="month">
        <el-select v-model="formData.month" placeholder="Select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="本月总预算" prop="total">
        <el-input type="number" clearable :prefix-icon="Coin" v-model="formData.total" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formInst, onSubmitPass, onSubmitError)">创建</el-button>
        <el-button @click="dialog = !dialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
