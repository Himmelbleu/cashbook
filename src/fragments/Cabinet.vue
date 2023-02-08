<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import type { UploadProps } from "element-plus";

const cabinetVal = useStorage<any>("cabinet", {});
const cashbook = useStorage<any>("cashbook", {});

const name = ref(cabinetVal.value.name);

function update() {
  cabinetVal.value = {
    name: name.value
  };
}

function exportJson() {
  const blob = new Blob([JSON.stringify(cashbook.value)], { type: "text/json" });
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
      const result = reader.result;
      cashbook.value = JSON.parse(result + "");
    };
  }
};
</script>

<template>
  <div class="fsz-1.5 mb-6">账本信息</div>
  <el-input v-model="name" placeholder="请输入记账本持有者" />
  <el-button plain class="mt-4" @click="update" type="primary">更新</el-button>
  <div class="fsz-1.5 mt-4">数据管理</div>
  <div class="mt-6">
    <el-button plain type="primary" @click="exportJson">导出账本数据</el-button>
  </div>
  <div class="mt-6">
    <el-upload :limit="1" :auto-upload="false" :on-change="importJson">
      <el-button plain type="primary">导入账本数据</el-button>
    </el-upload>
  </div>
</template>

<style scoped lang="scss"></style>
