<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import type { UploadProps } from "element-plus";

const cabinetVal = useStorage<any>("cabinet", {});
const bill = useStorage<any>("bill", {});

const name = ref(cabinetVal.value.name);

function update() {
  cabinetVal.value = {
    name: name.value
  };
}

function exportJson() {
  const data = JSON.stringify(bill.value);
  const blob = new Blob([data], { type: "text/json" });
  const a = document.createElement("a");
  a.download = "bill-data.json";
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  a.click();
}

const importJson: UploadProps["onChange"] = async file => {
  if (file.raw) {
    const reader = new FileReader();
    reader.readAsText(file.raw);
    reader.onload = () => {
      const result = reader.result;
      bill.value = JSON.parse(result + "");
    };
  }
};
</script>

<template>
  <div class="fsz-1.5 mb-6">账单信息</div>
  <el-input v-model="name" placeholder="请输入记账本持有者" />
  <el-button plain text class="mt-4" @click="update" type="primary">更新</el-button>
  <div class="fsz-1.5 mt-4">数据管理</div>
  <div class="mt-6">
    <el-button plain type="primary" @click="exportJson">导出数据</el-button>
  </div>
  <div class="mt-6">
    <el-upload :limit="1" :auto-upload="false" :on-change="importJson">
      <el-button plain type="primary">导入数据</el-button>
    </el-upload>
  </div>
</template>

<style scoped lang="scss"></style>
