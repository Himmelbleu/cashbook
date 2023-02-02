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
const formData = reactive(<Outlay>props.outlay);
const form = ref<FormInstance>();

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      bills.value[props.billIndex].outlays![props.outlayIndex] = formData;
      ElMessage({
        type: "success",
        message: "修改成功！"
      });
      dialogVisible.value = !dialogVisible.value;
    } else {
      ElMessage({
        type: "success",
        message: "修改失败！检查输入的值是否正确"
      });
    }
  });
};
</script>

<template>
  <div>
    <el-button @click="dialogVisible = !dialogVisible" size="small" type="primary" text>编辑开支</el-button>
    <el-dialog v-model="dialogVisible" title="修改开支项" width="100%">
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
          <el-button type="primary" @click="onSubmit(form)">更新</el-button>
          <el-button @click="dialogVisible = !dialogVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
