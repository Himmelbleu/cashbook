<script setup lang="ts">
import { useStorage, useNow, useDateFormat } from "@vueuse/core";
import { ICashbook, ICabinet } from "../types/data-type";

const cashbook = useStorage<ICashbook>("cashbook", {});
const cabinet = useStorage<ICabinet>("cabinet", {});
const nowYear = ref(useDateFormat(useNow(), "YYYY").value);
const isDisplayModal = ref(false);
const montKeys = Object.keys(cashbook.value[nowYear.value] || []);

const calcSurplus = computed(() => (key: string) => {
  const nowMont = cashbook.value[nowYear.value][key];
  let isFirstMonth = false;
  let expenses = 0;
  let surplus = 0;

  nowMont.outlays?.forEach(ele => {
    expenses += Number(ele.cost);
  });

  montKeys.forEach((ele, index) => {
    if (key == ele && index == 0) {
      isFirstMonth = true;
    }
  });

  surplus = Number(nowMont.budget) - expenses;

  if (!isFirstMonth) {
    const nowK = montKeys.findIndex(ele => ele == key);
    const preMont = cashbook.value[nowYear.value][montKeys[nowK - 1]];
    if (preMont?.surplus && nowMont?.budget) {
      surplus = Number(nowMont.budget) - expenses + Number(preMont.surplus);
    }
  }

  nowMont.surplus = Number(surplus.toFixed(2));

  return nowMont.surplus;
});

function importJson(newCashbook: ICashbook) {
  cashbook.value = newCashbook;
}

function changeYear(newYear: string) {
  nowYear.value = newYear;
}
</script>

<template>
  <div class="main">
    <div class="header f-c-b">
      <TextIcon icon="operation" @click="isDisplayModal = !isDisplayModal" :icon-size="2" :text-size="1" />
      <div class="fsz-1.4">{{ cabinet.name }} 的账本</div>
    </div>
    <div class="menus mt-6">
      <CreateBill :cashbook="cashbook" :year="nowYear" />
    </div>
    <div class="content">
      <template v-for="(v, k, i) in cashbook[nowYear]" :key="i">
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
                      <AddOutlay :cashbook="cashbook" :year="nowYear" :month="k" />
                    </div>
                    <div class="f-c-c mt-2">
                      <UpdateBill :cashbook="cashbook" :year="nowYear" :month="k" :index="i" />
                    </div>
                    <div class="f-c-c mt-2">
                      <DeleteBill :cashbook="cashbook" :year="nowYear" :month="k" />
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
                        <UpdateOutlay :cashbook="cashbook" :outlay="item" :index="j" :year="nowYear" :month="k" />
                      </div>
                      <div class="f-c-c mt-2">
                        <DeleteOutlay :cashbook="cashbook" :index="j" :year="nowYear" :month="k" />
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
    <div class="cabinet absolute top-0 left-0" :class="{ 'z-99': isDisplayModal, 'z--1': !isDisplayModal }">
      <div class="relative">
        <div class="content bg p-4 w-60vw absolute top-0 left-0" :class="{ bg: isDisplayModal }">
          <SideView @change-year="changeYear" @import-json="importJson" :cashbook="cashbook" :cabinet="cabinet" />
        </div>
        <div @click="isDisplayModal = !isDisplayModal" class="modal w-40vw absolute top-0 left-60vw"></div>
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

.cabinet .content,
.cabinet .modal {
  height: 100vh;
}

.cabinet .modal {
  background-color: rgba(30, 30, 30, 0.5);
}
</style>
