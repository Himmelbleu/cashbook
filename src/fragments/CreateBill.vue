<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Coin } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

const bills = useStorage<any>("bills", []);
const formData = reactive(<{ month: number; total: number }>{
  month: 0,
  total: 1000
});
const dialogVisible = ref(false);
const checkTotal = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入本月总预算！"));
  }
  setTimeout(() => {
    const numLen = value.toString().length;
    if (!(numLen >= 2 && numLen <= 8)) {
      callback(new Error("预算最低十位，最高千万位！"));
    } else {
      callback();
    }
  }, 10);
};

const rules = reactive<FormRules>({
  total: [{ validator: checkTotal, trigger: "change" }]
});
const form = ref<FormInstance>();

function openCreateDialog() {
  dialogVisible.value = !dialogVisible.value;
  if (bills.value.length <= 12 && bills.value.length >= 0) {
    let mon = bills.value.length;
    formData.month = ++mon;
  }
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      bills.value.push(formData);
      ElMessage({
        type: "success",
        message: "创建成功！"
      });
      dialogVisible.value = !dialogVisible.value;
    } else {
      ElMessage({
        type: "success",
        message: "创建失败！检查输入的值是否正确"
      });
    }
  });
};
</script>

<template>
  <el-button @click="openCreateDialog">创建账单</el-button>
  <el-dialog v-model="dialogVisible" title="创建账单" width="100%">
    <div class="mb-6">当前创建的账单对应的月份：{{ formData.month }}</div>
    <el-form ref="form" :model="formData" :rules="rules" label-position="left">
      <el-form-item label="本月总预算" prop="total">
        <el-input type="number" clearable :prefix-icon="Coin" v-model="formData.total" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(form)">创建</el-button>
        <el-button @click="dialogVisible = !dialogVisible">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
