<script setup lang="ts">
import { PropType } from "vue";
import { useStorage } from "@vueuse/core";
import { Coin } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { Bill } from "../types/DataType";
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
const dialogVisible = ref(false);
const formData = reactive(<Bill>{
  total: bills.value[props.index].total
});
const formRules = reactive<FormRules>({
  total: [{ validator: validateMoney, trigger: "change" }]
});
const formInst = ref<FormInstance>();

function onSubmitPass() {
  bills.value[props.index].total = Number(formData.total);
  dialogVisible.value = !dialogVisible.value;
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
    <el-button text type="primary" size="small" @click="dialogVisible = !dialogVisible">修改账单</el-button>
    <el-dialog v-model="dialogVisible" title="创建账单" width="90%">
      <div class="mb-6">当前修改的账单对应的月份：{{ bill.month }}</div>
      <el-form ref="formInst" :model="formData" :rules="formRules" label-position="left">
        <el-form-item label="本月总预算" prop="total">
          <el-input type="number" clearable :prefix-icon="Coin" v-model="formData.total" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formInst, onSubmitPass, onSubmitError)">更新</el-button>
          <el-button @click="dialogVisible = !dialogVisible">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
