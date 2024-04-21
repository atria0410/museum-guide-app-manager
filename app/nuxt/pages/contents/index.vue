<template>
  <div>
    <div class="d-flex justify-end">
      <NuxtLink to="contents/form" class="disable-link-style">
        <v-btn variant="outlined" class="mb-3">コンテンツを追加</v-btn>
      </NuxtLink>
    </div>
    <DataTable :headers="headers" :items="contents" :items-length="contentTotalLength" @update="fetchContents">
      <template #[`item.isValid`]="{ item }">
        {{ item.isValid ? '有効' : '無効' }}
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, DataTableItems, Options } from '@/components/DataTable.vue'

const headers: DataTableHeader = [
  { title: '表示順', key: 'position', sortable: false, align: 'center', width: 80 },
  { title: 'コンテンツ名', key: 'name', sortable: false, align: 'start', width: 500 },
  { title: 'オススメ', key: 'isRecommend', sortable: false, align: 'start', width: 500 },
  { title: '公開・非公開', key: 'isPublic', sortable: false, align: 'center', width: 150 },
  { title: '編集', key: 'edit', sortable: false, align: 'center', width: 80 }
]

const contents = ref<DataTableItems>([])
const contentTotalLength = ref<number>(0)

// 言語情報一覧を取得
const fetchContents = async ({ page, itemsPerPage }: Options) => {
  const response = await $fetch('/api/contents', {
    method: 'GET',
    params: {
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage
    }
  })
  contents.value = response.items
  contentTotalLength.value = response.totalLength
}
</script>
