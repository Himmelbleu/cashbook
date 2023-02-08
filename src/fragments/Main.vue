<script setup lang="ts">
import { useStorage, useNow, useDateFormat } from "@vueuse/core";
import { Bill } from "../types/data-type";

const cashbook = useStorage<Bill>("cashbook", {});
const year = ref(useDateFormat(useNow(), "YYYY").value);
const montKs = Object.keys(cashbook.value[year.value] || []);

const calcSurplus = computed(() => (k: string) => {
  const nowMont = cashbook.value[year.value][k];
  let isFirstMonth = false;
  let expenses = 0;
  let surplus = 0;

  nowMont.outlays?.forEach(ele => {
    expenses += Number(ele.cost);
  });

  montKs.forEach((ele, index) => {
    if (k == ele && index == 0) {
      isFirstMonth = true;
    }
  });

  surplus = Number(nowMont.budget) - expenses;

  if (!isFirstMonth) {
    const nowK = montKs.findIndex(ele => ele == k);
    const preMont = cashbook.value[year.value][montKs[nowK - 1]];
    if (preMont?.surplus && nowMont?.budget) {
      surplus = Number(nowMont.budget) - expenses + Number(preMont.surplus);
    }
  }

  nowMont.surplus = surplus;

  return surplus;
});

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
      <template v-for="(v, k, i) in cashbook[year]" :key="i">
        <div class="item card mt-6 px-3 pb-6 pt-2">
          <div class="bill-head">
            <div class="mb-4 f-c-b">
              <div class="month fsz-1.2">{{ k }} 月</div>
              <el-dropdown trigger="click">
                <div class="f-c-c">
                  <div class="mr-1 sec-color">操作</div>
                  <el-icon><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                  <div class="my-2">
                    <div class="f-c-c">
                      <AddOutlay :cashbook="cashbook" :year="year" :month="k" />
                    </div>
                    <div class="f-c-c mt-2">
                      <UpdateBill :cashbook="cashbook" :year="year" :month="k" :index="i" />
                    </div>
                    <div class="f-c-c mt-2">
                      <DeleteBill :cashbook="cashbook" :year="year" :month="k" />
                    </div>
                  </div>
                </template>
              </el-dropdown>
            </div>
            <div class="total f-c-b fsz-1.2">预算：{{ v.budget }}</div>
          </div>
          <div class="bill-body mt-6">
            <div class="outlay-head mb-6">
              <div v-if="v.outlays && v.outlays.length" class="f-c-b">
                <div class="w-15% sec-color">标签</div>
                <div class="w-45% sec-color">备注</div>
                <div class="w-25% sec-color">金额</div>
                <div class="w-15%"></div>
              </div>
              <div v-else class="fsz-1.2 f-c-c sec-color">没有开支</div>
            </div>
            <div class="outlay mb-6 f-c-b" v-for="(item, j) in v.outlays" :key="j">
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
                        <UpdateOutlay :cashbook="cashbook" :outlay="item" :index="j" :year="year" :month="k" />
                      </div>
                      <div class="f-c-c mt-2">
                        <DeleteOutlay :cashbook="cashbook" :index="j" :year="year" :month="k" />
                      </div>
                    </div>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="bill-bott mt-6 f-c-e text-right sec-color">本月剩余：{{ calcSurplus(k) }}</div>
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
