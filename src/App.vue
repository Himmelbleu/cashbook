<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Bill } from "./types/DataType";

const bills = useStorage<Bill[]>("bills", []);

function surplus(current: Bill, last: Bill) {
  let result = Number(current.total!);
  current.outlays?.forEach(element => {
    result -= element.cost!;
  });
  if (last) {
    result += last.surplus!;
  }
  current.surplus = Number(result);
  return result;
}

function realTotal(current: Bill, last: Bill) {
  let result = Number(current.total!);
  if (last.surplus) {
    result += Number(last.surplus!);
  }
  return result;
}
</script>

<template>
  <div class="header f-c-b">
    <TextIcon icon="menu" :icon-size="2" :text-size="1" />
    <div class="fsz-1.4">Himmelbleu 的账单</div>
  </div>
  <div class="menus mt-6">
    <el-button>选择年份</el-button>
    <CreateBill />
  </div>
  <div class="content">
    <div class="item card fsz-1.2 mt-6 px-3 pb-6 pt-2" v-for="(bill, billIndex) in bills" :key="billIndex">
      <div class="bill-head">
        <div class="mb-4 f-c-b">
          <div class="month">{{ bill.month }} 月</div>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <div class="my-2">
                <div class="f-c-c">
                  <AddOutlay :bill="bill" :index="billIndex" />
                </div>
                <div class="f-c-c mt-2">
                  <UpdateBill :bill="bill" :index="billIndex" />
                </div>
              </div>
            </template>
          </el-dropdown>
        </div>
        <div class="f-c-b">
          <div class="total">总额：{{ bill.total }}</div>
          <div class="real-total" v-if="bills[billIndex - 1]">
            实际总额：{{ realTotal(bill, bills[billIndex - 1]) }}
          </div>
        </div>
      </div>
      <div class="bill-body mt-6">
        <div class="outlay mb-4 f-c-b" v-for="(outlay, outlayIndex) in bill.outlays" :key="outlayIndex">
          <div class="w-15%">
            <el-tag v-if="outlay.label">{{ outlay.label }}</el-tag>
          </div>
          <div class="fsz-0.9 w-45% px-4">{{ outlay.text }}</div>
          <div class="fsz-0.9 w-25% px-4">{{ outlay.cost }}</div>
          <div class="fsz-0.9 w-15%">
            <UpdateOutlay :bill="bill" :outlay="outlay" :bill-index="billIndex" :outlay-index="outlayIndex" />
          </div>
        </div>
      </div>
      <div class="bill-bott mt-6 f-c-e">
        <div>剩余：{{ surplus(bill, bills[billIndex - 1]) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  border: {
    width: 1px;
    color: var(--sec-text-color);
    style: solid;
    radius: 0.6rem;
  }
}
</style>
