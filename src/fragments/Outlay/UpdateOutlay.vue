<script setup lang="ts">
import { PropType } from "vue";
import { Coin, Discount, ChatDotRound } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { IOutlay, ICashbook } from "../../types/data-type";
import { validateMoney, onSubmit } from "../../helpers/form-helper";

const props = defineProps({
  cashbook: {
    type: Object as PropType<ICashbook>,
    required: true
  },
  nowYear: {
    type: String,
    required: true
  },
  nowMonth: {
    type: String,
    required: true
  },
  outlay: {
    type: Object as PropType<IOutlay>,
    required: true
  },
  outlayIndex: {
    type: Number,
    required: true
  }
});

const dialog = ref(false);
const rule = reactive<FormRules>({
  cost: [{ validator: validateMoney, trigger: "change" }]
});
const form = reactive(<IOutlay>props.outlay);
const formInst = ref<FormInstance>();

function onSubmitPass() {
  props.cashbook[props.nowYear][props.nowMonth].outlays![props.outlayIndex] = form;
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
          <el-button type="primary" @click="onSubmit(formInst, onSubmitPass, onSubmitError)">更新</el-button>
          <el-button @click="dialog = !dialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
