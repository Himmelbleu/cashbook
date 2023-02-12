<script setup lang="ts">
import { PropType } from "vue";
import type { UploadProps } from "element-plus";
import { ICashbook, ICabinet } from "../types/data-type";

const props = defineProps({
  cashbook: {
    type: Object as PropType<ICashbook>,
    required: true
  },
  cabinet: {
    type: Object as PropType<ICabinet>,
    required: true
  }
});
const emits = defineEmits(["importJson", "changeYear"]);
const name = ref(props.cabinet.name);

function update() {
  props.cabinet.name = name.value;
}

function exportJson() {
  const blob = new Blob([JSON.stringify(props.cashbook)], { type: "text/json" });
  const a = document.createElement("a");
  a.download = "cashbook.json";
  a.href = URL.createObjectURL(blob);
  a.click();
}

const importJson: UploadProps["onChange"] = async file => {
  if (file.raw) {
    const reader = new FileReader();
    reader.readAsText(file.raw);
    reader.onload = () => {
      emits("importJson", JSON.parse(reader.result + ""));
    };
  }
};

const yearList = Object.keys(props.cashbook).map(x => {
  return { value: x, label: `${x} 年` };
});
const options = ref(yearList);
const selectedYear = ref(yearList[0]?.value);

function changeYear() {
  emits("changeYear", selectedYear.value);
}
</script>

<template>
  <div class="mb-4">
    <div class="fsz-1.4 mb-4">账本信息</div>
    <el-input class="mb-4" v-model="name" placeholder="请输入记账本持有者" />
    <el-button plain @click="update" type="primary">更新</el-button>
  </div>
  <div class="mb-4">
    <div class="fsz-1.4 mb-4">数据管理</div>
    <el-button class="mb-4" plain type="primary" @click="exportJson">导出账本数据</el-button>
    <el-upload :limit="1" :auto-upload="false" :on-change="importJson">
      <el-button plain type="primary">导入账本数据</el-button>
    </el-upload>
  </div>
  <div class="mb-4">
    <div class="fsz-1.4 mb-4">账本年份</div>
    <el-select @change="changeYear" v-model="selectedYear" placeholder="Select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value" />
    </el-select>
  </div>
</template>

<style scoped lang="scss"></style>
