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
const dialog = ref(false);
const formRule = reactive<FormRules>({
  cost: [{ validator: validateMoney, trigger: "change" }]
});
const formData = reactive(<Outlay>props.outlay);
const formInst = ref<FormInstance>();

function onSubmitPass() {
  bills.value[props.billIndex].outlays![props.outlayIndex] = formData;
  dialog.value = !dialog.value;
  ElMessage({
    type: "success",
    message: "修改成功！"
  });
}

function onSubmitError() {
  ElMessage({
    type: "success",
    message: "修改失败！检查输入的值是否正确"
  });
}
</script>

<template>
  <div>
    <el-button @click="dialog = !dialog" size="small" type="primary" text>编辑支出</el-button>
    <el-dialog v-model="dialog" title="修改支出项" width="90%">
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
          <el-button type="primary" @click="onSubmit(formInst, onSubmitPass, onSubmitError)">更新</el-button>
          <el-button @click="dialog = !dialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
