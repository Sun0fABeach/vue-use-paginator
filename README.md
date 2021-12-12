# vue-use-paginator

Vue 3 composition API hook function to reactively paginate data and arrange paginator buttons. Completely renderless.

## Installation

```shell
$ npm install vue-use-paginator
```

## Basic Setup

```html
<script lang="ts">
import { defineComponent, ref } from 'vue'
import usePaginator from 'vue-use-paginator'

export default defineComponent({
  setup() {
    const numButtons = ref(2)
    return usePaginator(numButtons)
  }
})
</script>
```

## Details

### Hook API

Function `usePaginator` expects the number of pagination buttons you want to display and returns an object of type `IPagination` which contains the following reactive data plus some convenience functions.

| Name           | Type                               | Description
| -------------- | ---------------------------------- | -----------
| `page`         | `Ref<number>`                     | Current active page (initial value: 1)
| `pageSize`     | `Ref<number>`                     | Size of each page (initial value: 5)
| `numItems`     | `Ref<number>`                     | Total number of items to paginate (initial value: 0)
| `numPages`     | `ComputedRef<number>`             | Total number of pages
| `slice`        | `ComputedRef<[number, number]>`    | Tuple containing start and end index delimiting the currently active page (0 based, end index is exclusive). For example, given you are on page 2, `pageSize` is 10 and `numItems` is greater than or equal to 20, `slice` will be `[10, 20]`.
| `buttons`      | `ComputedRef<IPaginatorButton[]>` | Array of objects usable for displaying paginator buttons (details below)
| `hasPrev`      | `ComputedRef<boolean>`            | Whether the currently active page is the first page
| `hasNext`      | `ComputedRef<boolean>`            | Whether the currently active page is the last page
| `goPrev`       | `() => number`                     | Go to next page
| `goNext`       | `() => number`                     | Go to previous page
| `goStart`      | `() => 1`                          | Go to first page
| `goEnd`        | `() => number`                     | Go to last page

* `page`, `pageSize`, `numItems`, as well as `numButtons` (used to call `usePaginator`) are writable refs that will cause the other reactive properties to adjust when changed. Once you know how many items to paginate, you need to set `numItems` at least.
* You can move to another page by either calling `goPrev`, `goNext`, `goStart`, `goEnd`, or by assigning to `page` directly. Note that assigning a value outside of 1 and `numPages` will be ignored.

### Paginator buttons

When displaying paginator buttons, you often don't have enough slots for each page and therefore need to use a placeholder like '...'. Calculating the positions of these placeholders is not trivial. Luckily, `buttons` is an array of `IPaginatorButton` where each item contains the following properties to help you out.

| Name       | Type       | Description
| ---------- | ---------- | -----------
| `page`     | `number`   | The page to navigate to when clicking this button
| `active`   | `boolean`  | Whether this button shows the currently active page
| `ellipsis` | `boolean`  | Whether this button is a placeholder for omitted pages

#### Template example

Here is a minimal example how you could write your paginator markup.

```html
<ol>
  <li :class="!hasPrev && 'disabled'" @click="goStart">
    {{ '<<' }}
  </li>
  <li :class="!hasPrev && 'disabled'" @click="goPrev">
    {{ '<' }}
  </li>
  <li
    v-for="button in buttons"
    :key="button.page"
    :class="{ 'current-page': button.active }"
    @click="page = button.page"
  >
    {{ button.ellipsis ? '...' : button.page }}
  </li>
  <li :class="!hasNext && 'disabled'" @click="goNext">
    {{ '>' }}
  </li>
  <li :class="!hasNext && 'disabled'" @click="goEnd">
    {{ '>>' }}
  </li>
</ol>
```

Notice how certain classes and texts are set based on the values of `hasPrev`, `hasNext`, `button.active` and `button.ellipsis`. How you style these elements is completely up to you.

### API integration

This library doesn't make any assumptions about whether you paginate in the frontend or call a paginated endpoint. If you do it in the frontend, just assign the length of your collection to  `numItems` and use the values from `slice` to slice out the items for your current page. If you call a paginated endpoint, it needs to tell you the total number of items in order to set `numItems`. You can then use `slice` or `page`/`pageSize` for your request payload to fetch the desired page.

### Types

#### Definitions

```ts
interface IPagination {
    page: Ref<number>
    pageSize: Ref<number>
    numItems: Ref<number>
    numPages: ComputedRef<number>
    slice: ComputedRef<[number, number]>
    buttons: ComputedRef<IPaginatorButton[]>
    hasPrev: ComputedRef<boolean>
    hasNext: ComputedRef<boolean>
    goPrev: () => number
    goNext: () => number
    goStart: () => 1
    goEnd: () => number
}

interface IButton {
    page: number
}

interface IPageButton extends IButton {
    active: boolean
    ellipsis: false
}

interface IEllipsisButton extends IButton {
    active: false
    ellipsis: true
}

type IPaginatorButton = IPageButton | IEllipsisButton

```

#### Importing

```ts
import { IPagination, IPaginatorButton } from 'vue-use-paginator'
```
