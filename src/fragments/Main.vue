<script setup lang="ts">
import { useStorage, useNow, useDateFormat } from "@vueuse/core";
import { ICashbook, ICabinet } from "../types/data-type";

const cashbook = useStorage<ICashbook>("cashbook", {});
const cabinet = useStorage<ICabinet>("cabinet", {});
const nowYear = ref(useDateFormat(useNow(), "YYYY").value);
const isDisModal = ref(false);
const monthKeys = Object.keys(cashbook.value[nowYear.value] || []);

const calcSurplus = computed(() => (monthKey: string) => {
  const nowMonth = cashbook.value[nowYear.value][monthKey];
  let isFirstMonth = false;
  let expenses = 0;
  let surplus = 0;

  nowMonth.outlays?.forEach(ele => {
    expenses += Number(ele.cost);
  });

  monthKeys.forEach((element, index) => {
    if (monthKey == element && index == 0) {
      isFirstMonth = true;
    }
  });

  surplus = Number(nowMonth.budget) - expenses;

  if (!isFirstMonth) {
    const nowMonthKey = monthKeys.findIndex(ele => ele == monthKey);
    const preMonth = cashbook.value[nowYear.value][monthKeys[nowMonthKey - 1]];
    if (preMonth?.surplus && nowMonth?.budget) {
      surplus = Number(nowMonth.budget) - expenses + Number(preMonth.surplus);
    }
  }

  nowMonth.surplus = Number(surplus.toFixed(2));

  return nowMonth.surplus;
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
      <TextIcon icon="operation" @click="isDisModal = !isDisModal" :icon-size="2" :text-size="1" />
      <div class="fsz-1.4">{{ cabinet.name }} 的账本</div>
    </div>
    <div class="menus mt-6">
      <CreateBill :cashbook="cashbook" :now-year="nowYear" />
    </div>
    <div class="content">
      <template v-for="(monthVal, monthKey, billIndex) in cashbook[nowYear]" :key="i">
        <div class="item card mt-6 px-3 pb-6 pt-2">
          <div class="bill-head">
            <div class="mb-4 f-c-b">
              <div class="month fsz-1.2">{{ monthKey }} 月</div>
              <el-dropdown trigger="click">
                <div class="f-c-c">
                  <div class="mr-1 sec-color">操作</div>
                  <el-icon><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                  <div class="my-2">
                    <div class="f-c-c">
                      <AddOutlay :cashbook="cashbook" :now-year="nowYear" :now-month="monthKey" />
                    </div>
                    <div class="f-c-c mt-2">
                      <UpdateBill
                        :cashbook="cashbook"
                        :now-year="nowYear"
                        :now-month="monthKey"
                        :bill-index="billIndex" />
                    </div>
                    <div class="f-c-c mt-2">
                      <DeleteBill :cashbook="cashbook" :now-year="nowYear" :now-month="monthKey" />
                    </div>
                  </div>
                </template>
              </el-dropdown>
            </div>
            <div class="total f-c-b fsz-1.2">预算：{{ monthVal.budget }}</div>
          </div>
          <div class="bill-body mt-6">
            <div class="outlay-head mb-6">
              <div v-if="monthVal.outlays && monthVal.outlays.length" class="f-c-b">
                <div class="w-15% sec-color">标签</div>
                <div class="w-45% sec-color">备注</div>
                <div class="w-25% sec-color">金额</div>
                <div class="w-15%"></div>
              </div>
              <div v-else class="fsz-1.2 f-c-c sec-color">没有开支</div>
            </div>
            <div
              class="outlay-body mb-6 f-c-b"
              v-for="(outlay, outlayIndex) in monthVal.outlays"
              :key="outlayIndex">
              <div class="w-15%">
                <el-tag v-if="outlay.label">{{ outlay.label }}</el-tag>
              </div>
              <div class="w-45%">{{ outlay.text }}</div>
              <div class="w-25%">{{ outlay.cost }}</div>
              <div class="w-15% f-c-c">
                <el-dropdown trigger="click">
                  <div class="f-c-c">
                    <div class="mr-1 sec-color">操作</div>
                    <el-icon><arrow-down /></el-icon>
                  </div>
                  <template #dropdown>
                    <div class="my-2">
                      <div class="f-c-c">
                        <UpdateOutlay
                          :cashbook="cashbook"
                          :outlay="outlay"
                          :outlay-index="outlayIndex"
                          :now-year="nowYear"
                          :now-month="monthKey" />
                      </div>
                      <div class="f-c-c mt-2">
                        <DeleteOutlay
                          :cashbook="cashbook"
                          :outlay-index="outlayIndex"
                          :now-year="nowYear"
                          :now-month="monthKey" />
                      </div>
                    </div>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="bill-bott mt-6 f-c-e text-right sec-color">
            本月剩余：{{ calcSurplus(monthKey) }}
          </div>
        </div>
      </template>
    </div>
    <div class="cabinet absolute top-0 left-0" :class="{ 'z-99': isDisModal, 'z--1': !isDisModal }">
      <div class="relative">
        <div class="content bg p-4 w-60vw absolute top-0 left-0" :class="{ bg: isDisModal }">
          <SideView
            @change-year="changeYear"
            @import-json="importJson"
            :cashbook="cashbook"
            :cabinet="cabinet" />
        </div>
        <div @click="isDisModal = !isDisModal" class="modal w-40vw absolute top-0 left-60vw"></div>
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
