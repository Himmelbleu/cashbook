<script setup lang="ts">
import { PropType } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Coin } from "@element-plus/icons-vue";
import { validateMoney, onSubmit } from "../../helpers/form-helper";
import { ICashbook } from "../../types/data-type";

const props = defineProps({
  nowYear: {
    type: String,
    required: true
  },
  cashbook: {
    type: Object as PropType<ICashbook>,
    required: true
  }
});

const dialog = ref(false);
const form = reactive({
  month: 1,
  budget: 1800
});
const rule = reactive<FormRules>({
  budget: [{ validator: validateMoney, trigger: "change" }]
});
const formInst = ref<FormInstance>();

function onSubmitPass() {
  if (props.cashbook[props.nowYear]) {
    let hasMontKey = false;
    const montKeys = Object.keys(props.cashbook[props.nowYear]);

    if (montKeys) {
      montKeys.forEach(ele => {
        if (form.month.toString() === ele) {
          hasMontKey = true;
        }
      });
    }

    if (hasMontKey) {
      ElMessage({
        type: "error",
        message: "已有该月的账单，不要重复添加！"
      });
    } else {
      props.cashbook[props.nowYear][form.month] = {
        budget: form.budget,
        surplus: 0
      };
      dialog.value = !dialog.value;
      ElMessage({
        type: "success",
        message: "创建账单成功！"
      });
    }
  } else {
    props.cashbook[props.nowYear] = {
      [form.month]: {
        budget: form.budget,
        surplus: 0
      }
    };
    dialog.value = !dialog.value;
    ElMessage({
      type: "success",
      message: "创建账单成功！"
    });
  }
}

function onSubmitError() {
  ElMessage({
    type: "error",
    message: "创建账单失败，检查输入的值是否正确！"
  });
}

const options = <{ value: number; label: string }[]>[];
for (let i = 0; i < 12; i++) {
  options.push({
    value: i + 1,
    label: `${i + 1} 月`
  });
}
</script>

<template>
  <div>
    <el-button @click="dialog = !dialog">创建账单</el-button>
    <el-dialog v-model="dialog" title="创建账单" width="90%">
      <div class="mb-6">当前创建的账单对应的月份：{{ form.month }}</div>
      <el-form ref="formInst" :model="form" :rules="rule" label-position="left">
        <el-form-item label="账单的月份" prop="month">
          <el-select v-model="form.month" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="本月总预算" prop="budget">
          <el-input type="number" clearable :prefix-icon="Coin" v-model="form.budget" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formInst, onSubmitPass, onSubmitError)">创建</el-button>
          <el-button @click="dialog = !dialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
