<template>

  <AppPaginator
    v-if="!disablePagination && (TotalCount !== 0)"
    class="mb-10"
    v-model:current-page="currentPage"
    v-model:totalCount="TotalCount"
    :config="configPaginator"
    :isLoading="loading"
  />

</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import type { GetListingNftsQuery, GetListingNftsQueryVariables, NftToken } from '@/gql/graphql'
import { graphql } from '@/gql'
import { computed, reactive, ref, watch } from "vue";
import { useScrollEnd } from '@/composables/use-scroll-end'
import { useCommonStoreRefs } from '@/stores/common.store'

const { verbs } = useCommonStoreRefs();

const props = defineProps(['filter', 'cardWidth', 'fields', 'disablePagination', 'showCancel', 'pageSize'])
const V = computed(() => verbs.value.common);

const TotalCount = ref(1);
const currentPage = ref(1);
const defaultPageSize = 8;
const PageSize = computed(() => {
  return props.pageSize ? props.pageSize : defaultPageSize;
})
const offset = ref(0);

const configPaginator = reactive({
  pageSize: PageSize.value,
  page: currentPage.value,
  numItems: TotalCount.value,
  numButtons: 9
});

watch( () => currentPage.value, (v, old) => {
  offset.value = (currentPage.value - 1) * PageSize.value;
});
watch( () => props.filter, (v) => {
  currentPage.value = 1;
}, {deep: true});

let { result, loading, fetchMore, onResult } = useQuery<GetListingNftsQuery, GetListingNftsQueryVariables>(
  graphql(`
    query getListingNfts(
      $search: String
      $where: NftTokenFilterInput
      $offset: Int
      $limit: Int
    ) {
      nftTokens(search: $search, where: $where, skip: $offset, take: $limit,
`);

onResult(queryResult => {
  if(queryResult.loading) return;
  TotalCount.value = queryResult?.data?.nftTokens?.totalCount ?? 1;
});
</script>

<style lang="scss">
.ListingsList {
  width: 100%;
  //height: auto;
  height: fit-content;
  display: flex;
  flex-flow: row wrap;
  //align-items: center;
  gap: 16px;

  .card-item {
    display: block;
    height: auto;
  }

}
</style>
