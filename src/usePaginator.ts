import { ref, computed, watch, Ref, ComputedRef } from 'vue'

export interface IOptions {
  page?: number
  pageSize?: number
  numItems?: number
  numButtons?: number
}

export interface IPagination {
  page: Ref<number>
  pageSize: Ref<number>
  numItems: Ref<number>
  numButtons: Ref<number>
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

export interface IPageButton extends IButton {
  active: boolean
  ellipsis: false
}

export interface IEllipsisButton extends IButton {
  active: false
  ellipsis: true
}

export type IPaginatorButton = IPageButton | IEllipsisButton

const defaultOptions: Required<IOptions> = {
  page: 1,
  pageSize: 5,
  numItems: 0,
  numButtons: 5,
};


export default (userOptions: IOptions): IPagination => {
  const options: Required<IOptions> = { ...defaultOptions, ...userOptions }

  const _page = ref(options.page)
  const pageSize = ref(options.pageSize)
  const numItems = ref(options.numItems)
  const numButtons = ref(options.numButtons)

  const page = computed({
    get: () => _page.value,
    set: val => {
      if (val > 0 && val <= numPages.value) {
        _page.value = val
      }
    }
  })

  const numPages = computed(() => Math.ceil(numItems.value / pageSize.value))

  watch([pageSize, numItems], () => {
    if (page.value > numPages.value) {
      page.value = numPages.value
    }
  })

  const slice = computed((): [number, number] => {
    const start = (page.value - 1) * pageSize.value
    const end = Math.min(start + pageSize.value, numItems.value)
    return [start, end]
  })

  const hasPrev = computed(() => page.value > 1)
  const hasNext = computed(() => page.value < numPages.value)

  const goPrev = () => {
    if (hasPrev.value) [
      page.value--
    ]
    return page.value
  }
  const goNext = () => {
    if (hasNext.value) {
      page.value++
    }
    return page.value
  }
  const goStart = (): 1 => {
    page.value = 1
    return 1
  }
  const goEnd = () => {
    page.value = numPages.value
    return numPages.value
  }

  const buttons = computed<Array<IPaginatorButton>>(() => {
    if (numPages.value <= numButtons.value) {
      return fullButtons(page.value, numPages.value)
    } else {
      return partialButtons(page.value, numPages.value, numButtons.value)
    }
  })

  return {
    page,
    pageSize,
    numItems,
    numButtons,
    numPages,
    slice,
    hasPrev,
    hasNext,
    goPrev,
    goNext,
    goStart,
    goEnd,
    buttons,
  }
}


function fullButtons(page: number, numPages: number): Array<IPaginatorButton> {
  return consecutiveSlots(1, page)
    .concat({ page, active: true, ellipsis: false })
    .concat(consecutiveSlots(page + 1, numPages + 1))
}


function partialButtons(
  page: number, numPages: number, numButtons: number
): Array<IPaginatorButton> {
  let slotsLeft = 0, slotsRight = 0
  const halvedButtons = Math.floor(numButtons / 2)

  // check if either side can be filled with pages up to active page
  if (page <= halvedButtons) {
    slotsLeft = page - 1
    slotsRight = numButtons - slotsLeft - 1

  } else if (page >= numPages - halvedButtons) {
    slotsRight = numPages - page
    slotsLeft = numButtons - slotsRight - 1

  // page sits in center and has 1 or 2 adjacent ellipsis
  } else if (numButtons % 2 === 0) {
    slotsLeft = halvedButtons - 1
    slotsRight = halvedButtons
  } else {
    slotsLeft = halvedButtons
    slotsRight = halvedButtons
  }

  const pagesPrev = page - 1
  const pagesNext = numPages - page

  let list: Array<IPaginatorButton> = []

  if (pagesPrev <= slotsLeft) {
    list = consecutiveSlots(1, pagesPrev + 1)

  } else if (slotsLeft > 0) {
    const ellipsis = slotsLeft === 2 ? 2 : Math.ceil(slotsLeft / 2)
    const remaining = slotsLeft - ellipsis
    let ellipsisPage = Math.ceil(pagesPrev / 2)
    if (pagesPrev % 2 === 0) {
      ellipsisPage++
    }

    list = (consecutiveSlots(1, ellipsis) as Array<IPaginatorButton>)
      .concat({ page: ellipsisPage, active: false, ellipsis: true })
      .concat(consecutiveSlots(page - remaining, page))
  }

  list.push({ page, active: true, ellipsis: false })

  if (pagesNext <= slotsRight) {
    list = list.concat(consecutiveSlots(page + 1, numPages + 1))

  } else if (slotsRight > 0) {
    const ellipsis = slotsRight === 2 ? 1 : Math.floor(slotsRight / 2) + 1
    const remaining = slotsRight - ellipsis
    const ellipsisPage = page + Math.ceil(pagesNext / 2)

    list = list.concat(consecutiveSlots(page + 1, page + ellipsis))
      .concat({ page: ellipsisPage, active: false, ellipsis: true })
      .concat(consecutiveSlots(numPages - remaining + 1, numPages + 1))
  }

  return list
}

function consecutiveSlots(startIdx: number, endIdx: number): Array<IPageButton> {
  const result: Array<IPageButton> = []
  for (let idx = startIdx; idx < endIdx; idx++) {
    result.push({ page: idx, active: false, ellipsis: false })
  }
  return result
}
