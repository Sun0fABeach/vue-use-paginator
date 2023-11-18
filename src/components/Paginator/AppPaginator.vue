<template>
  <ul class="AppPaginator">
    <!--    <li class="control" :class="{ disabled: !hasPrev }" @click="goStart">-->
    <!--      {{ "<<" }}-->
    <!--    </li>-->
    <template v-if="isSkeletonLoading">
      <div class="skeletor-container">
        <div class="first-arrow skeleton-loading">
          <i class="icon-arrow-l"></i>
        </div>
        <div class="main-cells skeleton-loading" v-for="i in 7" :key="i"/>
        <div class="last-arrow skeleton-loading">
          <i class="icon-arrow-r"></i>
        </div>
      </div>
    </template>
    <template v-else>
      <li class="control me-1" :class="{ disabled: !hasPrev }" @click="goPrev">
        <!--      {{ "<" }}-->
        <i class="icon-arrow-l"></i>
      </li>
      <li
        v-for="(button, idx) in buttons"
        :key="idx"
        :class="{ 'current-page': button.active }"
        @click="Page = button.page"
      >
        {{ button.ellipsis ? "..." : button.page }}
      </li>
      <li class="control ms-1" :class="{ disabled: !hasNext }" @click="goNext">
        <!--      {{ ">" }}-->
        <i class="icon-arrow-r"></i>
      </li>
    </template>
    <!--    <li class="control" :class="{ disabled: !hasNext }" @click="goEnd">-->
    <!--      {{ ">>" }}-->
    <!--    </li>-->
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import usePaginator from "vue-use-paginator";
// const usePaginator = require('vue-use-pagina``tor');

const props = defineProps(["config",'currentPage','totalCount','isLoading']);
const emit = defineEmits(["update:current-page",'update:total-count']);

let Page = computed({
  get() {
    return page.value;
  },
  set(v) {
    page.value = v;
    emit("update:current-page", page.value);
  },
});
const isSkeletonLoading = ref<boolean>(true);

watch(() => props.isLoading, (v) => {
  if (!v) {
    isSkeletonLoading.value = false;
  }
});

watch( () => props.totalCount, (v, old) => numItems.value = props.totalCount);
watch(() => props.currentPage, (v) => page.value = v);

const {
  page,
  pageSize,
  numPages,
  numItems,
  numButtons,
  slice,
  buttons,
  hasPrev,
  hasNext,
  // goStart,
  goPrev,
  goNext,
  // goEnd,
} = usePaginator({ ...props.config, page: props.currentPage, numItems: props.totalCount});
watch(() => page.value, (v) => {
  if(!page?.value) return;
  emit("update:current-page", page.value);
});
</script>

<style lang="scss">
/****  AppPaginator.vue  ****/
.skeletor-container {
  display: flex;
  gap: 2px;
  .first-arrow, .last-arrow, .main-cells {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background-color: hsla(0, 0%, 100%, 0.05);
  }
  .main-cells {
    display: flex;
    gap: 2px;
  }
}

ul.AppPaginator {
  display: flex;
  list-style: none;
  user-select: none;
  padding: 0;
  height: 32px;
  margin: 0;
  li {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 32px;
    height: 100%;
    //border: 1px solid black;
    border-radius: 4px;
    color: var(--c-label-2)
  }
  li:not(.current-page):hover {
    //font-weight: bold;
    border-width: 2px;
    color: var(--primary-cl);
  }
  li.current-page {
    color: var(--primary-cl);
    background-color: var(--bw-100_05);
    //border-color: blue;
  }
  li.control {
    border: none;
    font-weight: 300;
    font-size: 18px;
    background-color: var(--bw-100_05);
  }
  li.control.disabled {
    opacity: 0.5;
    pointer-events: none;
  }


}
</style>
