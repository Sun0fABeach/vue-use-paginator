<template>
  <h1>Test Pagination</h1>

  <form action="" @submit.prevent.stop>
    <label>
      num buttons
      <input type="number" v-model.number="numButtons">
    </label>
    <br>
    <label>
      num items
      <input type="number" v-model.number="numItems">
    </label>
    <br>
    <label>
      page size
      <select v-model.number="pageSize">
        <option>5</option>
        <option>10</option>
        <option>25</option>
        <option>50</option>
        <option>100</option>
      </select>
    </label>
    <br>
    <label>
      page
      <input type="number" v-model.number="page">
    </label>
    <br>
    <div>num pages: {{ numPages }}</div>

    <br>

    <div>has prev: {{ hasPrev }}</div>
    <div>has next: {{ hasNext }}</div>

    <br>

    <div>slice: {{ slice }}</div>

    <br>

    <label>buttons:</label>
    <ul>
      <li v-for="(button, idx) in buttons" :key="idx">
        {{ button }}
      </li>
    </ul>

    <label>styled:</label>
    <ol class="paginator">
      <li class="control" :class="!hasPrev && 'disabled'" @click="goStart">
        {{ '<<' }}
      </li>
      <li class="control" :class="!hasPrev && 'disabled'" @click="goPrev">
        {{ '<' }}
      </li>
      <li
        v-for="(button, idx) in buttons"
        :key="idx"
        :class="{ 'current-page': button.active }"
        @click="page = button.page"
      >
        {{ button.ellipsis ? '...' : button.page }}
      </li>
      <li class="control" :class="!hasNext && 'disabled'" @click="goNext">
        {{ '>' }}
      </li>
      <li class="control" :class="!hasNext && 'disabled'" @click="goEnd">
        {{ '>>' }}
      </li>
    </ol>

  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import usePaginator from '../usePaginator'

export default defineComponent({
  setup() {
    return usePaginator({
      pageSize: 10,
      numItems: 70,
      numButtons: 5,
    })
  }
})
</script>

<style scoped>
ol.paginator {
  display: flex;
  list-style: none;
  user-select: none;
}
ol.paginator li {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 50px;
  height: 50px;
  border: 1px solid black;
}
ol.paginator li:not(.current-page):hover {
  font-weight: bold;
  border-width: 2px;
  cursor: pointer;
}
ol.paginator li.current-page {
  color: blue;
  border-color: blue;
}
ol.paginator li.control {
  border: none;
  font-weight: 900;
  cursor: pointer;
}
ol.paginator li.control.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>