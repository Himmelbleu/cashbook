<script setup lang="ts">
const props = defineProps({
  year: {
    type: String,
    required: true
  }
});

const options = ref<any>([
  {
    label: "Before",
    options: []
  },
  {
    label: "After",
    options: []
  }
]);
const numYear = ref(Number(props.year));
let year = Number(props.year);

for (let i = 10; i >= 0; i--) {
  options.value[1].options.push({
    value: year,
    label: `${year} 年`
  });
  year++;
}

year = Number(props.year);

for (let i = 0; i < 10; i++) {
  options.value[0].options.push({
    value: year,
    label: `${year} 年`
  });
  year--;
}

const emits = defineEmits(["change"]);

function change(val: any) {
  emits("change", numYear.value);
}
</script>

<template>
  <div>
    <el-select @change="change" v-model="numYear" placeholder="Select">
      <el-option-group v-for="group in options" :key="group.label" :label="group.label">
        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
      </el-option-group>
    </el-select>
  </div>
</template>

<style scoped lang="scss"></style>
