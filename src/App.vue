<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Bill } from "./types/data-type";

const bills = useStorage<Bill[]>("bills", []);
const sequence = ref(true);

function ascend() {
  bills.value.sort((a, b) => {
    return Number(a.month) - Number(b.month);
  });
  sequence.value = true;
}

function descend() {
  bills.value.sort((a, b) => {
    return Number(b.month) - Number(a.month);
  });
  sequence.value = false;
}

descend();

watch(bills, () => {
  sequence.value ? ascend() : descend();
});

const calcSurplus = computed(() => (current: Bill, last: Bill) => {
  let result = Number(current.total);
  current.outlays?.forEach(element => {
    result -= Number(element.cost);
  });
  if (last) result += Number(last.surplus);
  current.surplus = Number(result);
  return result;
});

const calcRealTotal = computed(() => (current: Bill, last: Bill) => {
  let result = Number(current.total);
  if (last.surplus) result += Number(last.surplus);
  return result;
});

const calcYearTotal = computed(() => {
  let result = 0;
  bills.value.forEach(elem => {
    elem.outlays?.forEach(el => {
      result += Number(el.cost);
    });
  });
  return result;
});
</script>

<template>
  <div class="header f-c-b">
    <TextIcon icon="menu" :icon-size="2" :text-size="1" />
    <div class="fsz-1.4">Himmelbleu 的账单</div>
  </div>
  <div class="menus mt-6">
    <ChooseYear :bills="bills" />
    <CreateBill />
  </div>
  <div class="mt-6 f-c-b">
    <div class="fsz-1.4">今年总花费：{{ calcYearTotal }}</div>
    <div class="f-c-c fsz-1.6">
      <el-icon class="mr-4" @click="ascend"><CaretTop /></el-icon>
      <el-icon @click="descend"><CaretBottom /></el-icon>
    </div>
  </div>
  <div class="content">
    <template v-for="(bill, billIndex) in bills">
      <div class="item card fsz-1.2 mt-6 px-3 pb-6 pt-2" v-if="bill.show" :key="billIndex">
        <div class="bill-head">
          <div class="mb-4 f-c-b">
            <div class="month fsz-1.4">{{ bill.month }} 月</div>
            <el-dropdown trigger="click">
              <div class="f-c-c">
                <div class="mr-1">操作</div>
                <el-icon><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <div class="my-2">
                  <div class="f-c-c">
                    <AddOutlay :bill="bill" :index="billIndex" />
                  </div>
                  <div class="f-c-c mt-2">
                    <UpdateBill :bill="bill" :index="billIndex" />
                  </div>
                  <div class="f-c-c mt-2">
                    <DeleteBill :bill="bill" :index="billIndex" />
                  </div>
                </div>
              </template>
            </el-dropdown>
          </div>
          <div class="f-c-b">
            <div class="total">预算：{{ bill.total }}</div>
            <div class="real-total" v-if="bills[billIndex - 1]">
              实际预算：{{ calcRealTotal(bill, bills[billIndex - 1]) }}
            </div>
          </div>
        </div>
        <div class="bill-body mt-6">
          <div class="outlay-head mb-6">
            <div v-if="bill.outlays" class="f-c-b">
              <div class="w-15%">标签</div>
              <div class="w-45%">备注</div>
              <div class="w-25%">金额</div>
              <div class="w-15%"></div>
            </div>
            <div v-else class="fsz-2 f-c-c">没有开支</div>
          </div>
          <div class="outlay mb-6 f-c-b" v-for="(outlay, outlayIndex) in bill.outlays" :key="outlayIndex">
            <div class="w-15%">
              <el-tag v-if="outlay.label">{{ outlay.label }}</el-tag>
            </div>
            <div class="w-45%">{{ outlay.text }}</div>
            <div class="w-25%">{{ outlay.cost }}</div>
            <div class="w-15% f-c-c">
              <el-dropdown trigger="click">
                <div class="f-c-c">
                  <div class="mr-1">操作</div>
                  <el-icon><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                  <div class="my-2">
                    <div class="f-c-c">
                      <UpdateOutlay :bill="bill" :outlay="outlay" :bill-index="billIndex" :outlay-index="outlayIndex" />
                    </div>
                    <div class="f-c-c mt-2">
                      <DeleteOutlay :bill="bill" :outlay="outlay" :bill-index="billIndex" :outlay-index="outlayIndex" />
                    </div>
                  </div>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="bill-bott mt-6 f-c-e">
          <div>剩余：{{ calcSurplus(bill, bills[billIndex - 1]) }}</div>
        </div>
      </div>
    </template>
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
