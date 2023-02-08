<script setup lang="ts">
import { PropType } from "vue";
import { Coin, Discount, ChatDotRound } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { IOutlay, Bill } from "../../types/data-type";
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
  }
});

const dialog = ref(false);
const rule = reactive<FormRules>({
  cost: [{ validator: validateMoney, trigger: "change" }]
});
const form = reactive(<IOutlay>{
  cost: 10,
  label: "",
  text: ""
});
const formInst = ref<FormInstance>();

function onSubmitPass() {
  const montBill = props.cashbook[props.year][props.month];
  if (!montBill.outlays) montBill.outlays = [];
  montBill.outlays.push(form);
  dialog.value = !dialog.value;
  ElMessage({
    type: "success",
    message: "添加成功！"
  });
}

function onSubmitError() {
  ElMessage({
    type: "success",
    message: "此次操作失败，检查输入的值是否正确！"
  });
}
</script>

<template>
  <div>
    <el-button @click="dialog = !dialog" size="small" type="primary" text>添加支出</el-button>
    <el-dialog v-model="dialog" title="添加支出项" width="90%">
      <div class="mb-6">当前账单对应的月份：{{ month }}</div>
      <el-form ref="formInst" :model="form" :rules="rule" label-position="left">
        <el-form-item label="标签" prop="label">
          <el-input type="text" placeholder="请输入标签" clearable :prefix-icon="Discount" v-model="form.label" />
        </el-form-item>
        <el-form-item label="备注" prop="text">
          <el-input type="text" placeholder="请输入备注" clearable :prefix-icon="ChatDotRound" v-model="form.text" />
        </el-form-item>
        <el-form-item label="花费" prop="cost">
          <el-input type="number" clearable :prefix-icon="Coin" v-model="form.cost" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formInst, onSubmitPass, onSubmitError)">添加</el-button>
          <el-button @click="dialog = !dialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
