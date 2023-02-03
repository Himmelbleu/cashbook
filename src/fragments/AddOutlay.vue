<script setup lang="ts">
import { PropType } from "vue";
import { useStorage } from "@vueuse/core";
import { Coin, Discount, ChatDotRound } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { Outlay, Bill } from "../types/data-type";
import { validateMoney, onSubmit } from "../helpers/form-helper";

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
const dialog = ref(false);

const formRule = reactive<FormRules>({
  cost: [{ validator: validateMoney, trigger: "change" }]
});
const formData = reactive(<Outlay>{
  cost: 10,
  label: "",
  text: ""
});
const formInst = ref<FormInstance>();

function onSubmitPass() {
  if (!bills.value[props.index].outlays) {
    bills.value[props.index]["outlays"] = [];
  }
  bills.value[props.index]["outlays"]?.push(formData);
  dialog.value = !dialog.value;
  ElMessage({
    type: "success",
    message: "此次操作成功！"
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
      <div class="mb-6">当前账单对应的月份：{{ bill.month }}</div>
      <el-form ref="formInst" :model="formData" :rules="formRule" label-position="left">
        <el-form-item label="标签" prop="label">
          <el-input type="text" placeholder="请输入标签" clearable :prefix-icon="Discount" v-model="formData.label" />
        </el-form-item>
        <el-form-item label="备注" prop="text">
          <el-input
            type="text"
            placeholder="请输入备注"
            clearable
            :prefix-icon="ChatDotRound"
            v-model="formData.text" />
        </el-form-item>
        <el-form-item label="花费" prop="cost">
          <el-input type="number" clearable :prefix-icon="Coin" v-model="formData.cost" />
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
