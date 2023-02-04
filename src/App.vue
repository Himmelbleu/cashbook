<script setup lang="ts">
import { useStorage, useNow, useDateFormat } from "@vueuse/core";
import { Bill } from "./types/data-type";

const year = useDateFormat(useNow(), "YYYY").value;
const bill = useStorage<Bill>("bill", {});

const calcSurplus = computed(() => (now: Bill, last: Bill) => {});

const calcRealTotal = computed(() => (now: Bill, last: Bill) => {});

const calcYearTotal = computed(() => {});
</script>

<template>
  <div class="header f-c-b">
    <TextIcon icon="menu" :icon-size="2" :text-size="1" />
    <div class="fsz-1.4">Himmelbleu 的账单</div>
  </div>
  <div class="menus mt-6">
    <!-- <ChooseYear :bills="bill" /> -->
    <div class="mt-6">
      <CreateBill :bill="bill" :year="year" />
    </div>
  </div>
  <div class="mt-6 f-c-b">
    <div class="fsz-1.4">今年总花费：{{ calcYearTotal }}</div>
    <div class="f-c-c fsz-1.6">
      <!-- <el-icon class="mr-4" @click="ascend(bill, () => (sequence = true))"><CaretTop /></el-icon> -->
      <!-- <el-icon @click="descend(bill, () => (sequence = false))"><CaretBottom /></el-icon> -->
    </div>
  </div>
  <div class="content">
    <template v-for="(val, key, i) in bill['2023']" :key="i">
      <div class="item card fsz-1.2 mt-6 px-3 pb-6 pt-2">
        <div class="bill-head">
          <div class="mb-4 f-c-b">
            <div class="month fsz-1.4">{{ key }} 月</div>
            <el-dropdown trigger="click">
              <div class="f-c-c">
                <div class="mr-1">操作</div>
                <el-icon><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <div class="my-2">
                  <div class="f-c-c">
                    <AddOutlay :bill="bill" :year="year" :month="key" />
                  </div>
                  <div class="f-c-c mt-2">
                    <UpdateBill :bill="bill" :year="year" :month="key" :index="i" />
                  </div>
                  <div class="f-c-c mt-2">
                    <DeleteBill :bill="bill" :year="year" :month="key" />
                  </div>
                </div>
              </template>
            </el-dropdown>
          </div>
          <div class="f-c-b">
            <div class="total">预算：{{ val.total }}</div>
            <!-- <div class="real-total" v-if="bill[billIndex - 1]">
              实际预算：{{ calcRealTotal(bill, bill[billIndex - 1]) }}
            </div> -->
          </div>
        </div>
        <div class="bill-body mt-6">
          <div class="outlay-head mb-6">
            <div v-if="val.outlays && val.outlays.length" class="f-c-b">
              <div class="w-15%">标签</div>
              <div class="w-45%">备注</div>
              <div class="w-25%">金额</div>
              <div class="w-15%"></div>
            </div>
            <div v-else class="fsz-1.2 f-c-c">没有开支</div>
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
                  <div class="mr-1">操作</div>
                  <el-icon><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                  <div class="my-2">
                    <div class="f-c-c">
                      <UpdateOutlay :bill="bill" :outlay="item" :index="j" :year="year" :month="key" />
                    </div>
                    <div class="f-c-c mt-2">
                      <DeleteOutlay :bill="bill" :index="j" :year="year" :month="key" />
                    </div>
                  </div>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="bill-bott mt-6 f-c-e">
          <!-- <div>剩余：{{ calcSurplus(bill, bill[billIndex - 1]) }}</div> -->
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
