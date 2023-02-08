<script setup lang="ts">
import { useStorage, useNow, useDateFormat } from "@vueuse/core";
import { Bill } from "../types/data-type";

const cashbook = useStorage<Bill>("cashbook", {});
const year = ref(useDateFormat(useNow(), "YYYY").value);
const keys = Object.keys(cashbook.value[year.value] || []);

function calcSurplus(montKey: string) {
  const nowMont = cashbook.value[year.value][montKey];
  let totalSurplus = 0;
  nowMont.outlays?.forEach(ele => {
    totalSurplus += Number(ele.cost);
  });
  nowMont.surplus = Number(nowMont.total) - totalSurplus;
  return nowMont.surplus;
}

function calcRealSurplus(montKey: string) {
  const nowMont = cashbook.value[year.value][montKey];
  let realTotalSurplus = 0;
  let isFirstMonth = false;

  keys.forEach((ele, index) => {
    if (montKey == ele && index == 0) {
      isFirstMonth = true;
    }
  });

  if (!isFirstMonth) {
    const nowIndex = keys.findIndex(ele => ele == montKey);
    const preMont = cashbook.value[year.value][keys[nowIndex - 1]];
    if (preMont?.surplus && nowMont?.surplus) {
      realTotalSurplus = Number(preMont.surplus) + Number(nowMont.surplus);
    }
  }
  return realTotalSurplus;
}

function change(val: number) {
  year.value = val + "";
}
</script>

<template>
  <div class="main">
    <div class="menus mt-6">
      <ChooseYear @change="change" :cashbook="cashbook" :year="year" />
      <div class="mt-6">
        <CreateBill :cashbook="cashbook" :year="year" />
      </div>
    </div>
    <div class="content">
      <template v-for="(val, key, i) in cashbook[year]" :key="i">
        <div class="item card mt-6 px-3 pb-6 pt-2">
          <div class="bill-head">
            <div class="mb-4 f-c-b">
              <div class="month fsz-1.2">{{ key }} 月</div>
              <el-dropdown trigger="click">
                <div class="f-c-c">
                  <div class="mr-1 sec-color">操作</div>
                  <el-icon><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                  <div class="my-2">
                    <div class="f-c-c">
                      <AddOutlay :cashbook="cashbook" :year="year" :month="key" />
                    </div>
                    <div class="f-c-c mt-2">
                      <UpdateBill :cashbook="cashbook" :year="year" :month="key" :index="i" />
                    </div>
                    <div class="f-c-c mt-2">
                      <DeleteBill :cashbook="cashbook" :year="year" :month="key" />
                    </div>
                  </div>
                </template>
              </el-dropdown>
            </div>
            <div class="total f-c-b fsz-1.2">预算：{{ val.total }}</div>
          </div>
          <div class="bill-body mt-6">
            <div class="outlay-head mb-6">
              <div v-if="val.outlays && val.outlays.length" class="f-c-b">
                <div class="w-15% sec-color">标签</div>
                <div class="w-45% sec-color">备注</div>
                <div class="w-25% sec-color">金额</div>
                <div class="w-15%"></div>
              </div>
              <div v-else class="fsz-1.2 f-c-c sec-color">没有开支</div>
            </div>
            <div class="outlay mb-6 f-c-b" v-for="(item, j) in val.outlays" :key="j">
              <div class="w-15%">
                <el-tag v-if="item.label">{{ item.label }}</el-tag>
              </div>
              <div class="w-45%">{{ item.text }}</div>
              <div class="w-25%">{{ item.cost }}</div>
              <div class="w-15% f-c-c">
                <el-dropdown trigger="click">
                  <div class="f-c-c">
                    <div class="mr-1 sec-color">操作</div>
                    <el-icon><arrow-down /></el-icon>
                  </div>
                  <template #dropdown>
                    <div class="my-2">
                      <div class="f-c-c">
                        <UpdateOutlay :cashbook="cashbook" :outlay="item" :index="j" :year="year" :month="key" />
                      </div>
                      <div class="f-c-c mt-2">
                        <DeleteOutlay :cashbook="cashbook" :index="j" :year="year" :month="key" />
                      </div>
                    </div>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="bill-bott mt-6 f-c-e">
            <div>
              <div class="text-right mb-2 sec-color">本月剩余：{{ calcSurplus(key) }}</div>
              <div v-html="calcRealSurplus(key) ? '本月和上月共剩余：' + calcRealSurplus(key) : ''" />
            </div>
          </div>
        </div>
      </template>
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
