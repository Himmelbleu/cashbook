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
const dialogVisible = ref(false);

const checkTotal = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入支出金额！"));
  }
  setTimeout(() => {
    const numLen = value.toString().length;
    if (!(numLen >= 1 && numLen <= 12)) {
      callback(new Error("支出的金钱至少一位数！"));
    } else {
      callback();
    }
  }, 10);
};
const rules = reactive<FormRules>({
  cost: [{ validator: checkTotal, trigger: "change" }]
});
const formData = reactive(<Outlay>{
  cost: 10,
  label: "",
  text: ""
});
const form = ref<FormInstance>();

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!bills.value[props.index].outlays) {
        bills.value[props.index]["outlays"] = [];
      }
      bills.value[props.index].outlays!.push(formData);
      ElMessage({
        type: "success",
        message: "添加成功！"
      });
      dialogVisible.value = !dialogVisible.value;
    } else {
      ElMessage({
        type: "success",
        message: "添加失败！检查输入的值是否正确"
      });
    }
  });
};
</script>

<template>
  <div>
    <el-button @click="dialogVisible = !dialogVisible" size="small" type="primary" text>添加支出</el-button>
    <el-dialog v-model="dialogVisible" title="添加支出项" width="100%">
      <div class="mb-6">当前账单对应的月份：{{ bill.month }}</div>
      <el-form ref="form" :model="formData" :rules="rules" label-position="left">
        <el-form-item label="标签" prop="label">
          <el-input type="text" clearable :prefix-icon="Coin" v-model="formData.label" />
        </el-form-item>
        <el-form-item label="备注" prop="text">
          <el-input type="text" clearable :prefix-icon="Coin" v-model="formData.text" />
        </el-form-item>
        <el-form-item label="花费" prop="cost">
          <el-input type="number" clearable :prefix-icon="Coin" v-model="formData.cost" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">添加</el-button>
          <el-button @click="dialogVisible = !dialogVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
