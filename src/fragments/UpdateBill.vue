<script setup lang="ts">
import { PropType } from "vue";
import { useStorage } from "@vueuse/core";
import { Coin } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { Outlay, Bill } from "../types/DataType";

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
const formData = reactive(<Bill>{
  total: bills.value[props.index].total
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

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      bills.value[props.index].total = Number(formData.total);
      ElMessage({
        type: "success",
        message: "更新成功！"
      });
      dialogVisible.value = !dialogVisible.value;
    } else {
      ElMessage({
        type: "success",
        message: "更新失败！检查输入的值是否正确"
      });
    }
  });
};
</script>

<template>
  <div>
    <el-button text type="primary" size="small" @click="dialogVisible = !dialogVisible">修改账单</el-button>
    <el-dialog v-model="dialogVisible" title="创建账单" width="100%">
      <div class="mb-6">当前修改的账单对应的月份：{{ bill.month }}</div>
      <el-form ref="form" :model="formData" :rules="rules" label-position="left">
        <el-form-item label="本月总预算" prop="total">
          <el-input type="number" clearable :prefix-icon="Coin" v-model="formData.total" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">更新</el-button>
          <el-button @click="dialogVisible = !dialogVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
