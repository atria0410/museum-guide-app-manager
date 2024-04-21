<template>
  <div>
    <div class="d-flex justify-end mb-3">
      <v-btn variant="outlined" prepend-icon="mdi-sort-numeric-descending" @click="openSortDialog">表示順を変更</v-btn>
      <NuxtLink to="contents/form" class="disable-link-style">
        <v-btn variant="outlined" class="ml-4">コンテンツを追加</v-btn>
      </NuxtLink>
    </div>
    <DataTable :headers="headers" :items="contents" :items-length="contentTotalLength" @update="fetchContents">
      <template #[`item.isRecommend`]="{ item }">
        {{ item.isRecommend ? '★' : '' }}
      </template>
      <template #[`item.isPublic`]="{ item }">
        {{ item.isPublic ? '公開' : '非公開' }}
      </template>
    </DataTable>

    <v-dialog v-model="sortDialog" :max-width="1000" persistent>
      <v-card>
        <v-card-title>ドラッグアンドドロップで表示順を変更できます</v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-center">表示順</th>
                <th class="text-center">コンテンツ名</th>
                <th class="text-center">オススメ</th>
                <th class="text-center">公開・非公開</th>
              </tr>
            </thead>
            <draggable
              v-model="contentsForSort"
              tag="tbody"
              item-key="id"
              ghost-class="bg-blue-lighten-5"
              :animation="150"
            >
              <template #item="{ element }">
                <tr class="sortable-item">
                  <td class="text-center">{{ element.position }}</td>
                  <td class="text-left">{{ element.name }}</td>
                  <td class="text-center">{{ element.isRecommend ? '★' : '' }}</td>
                  <td class="text-center">{{ element.isValid ? '公開' : '非公開' }}</td>
                </tr>
              </template>
            </draggable>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeSortDialog">キャンセル</v-btn>
          <v-spacer />
          <v-btn color="success" variant="tonal" @click="updateContentSort">更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, Options } from '@/components/DataTable.vue'

const headers: DataTableHeader = [
  { title: '表示順', key: 'position', sortable: true, align: 'center', width: 80 },
  { title: 'コンテンツ名', key: 'name', sortable: true, align: 'start', width: 500 },
  { title: 'オススメ', key: 'isRecommend', sortable: true, align: 'center', width: 100 },
  { title: '公開・非公開', key: 'isPublic', sortable: true, align: 'center', width: 100 },
  { title: '編集', key: 'edit', sortable: false, align: 'center', width: 80 }
]

const contents = ref<Content[]>([])
const contentTotalLength = ref<number>(0)

const sortDialog = ref<boolean>(false)
const contentsForSort = ref<Content[]>([])

// 言語情報一覧を取得
const fetchContents = async ({ page, itemsPerPage, sortBy }: Options) => {
  $fetch('/api/contents', {
    method: 'GET',
    params: {
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      sortKey: sortBy[0]?.key,
      sortOrder: sortBy[0]?.order
    }
  }).then((data) => {
    contents.value = data.items
    contentTotalLength.value = data.totalLength
  })
}

// 並び替えダイアログを表示
const openSortDialog = async () => {
  sortDialog.value = true
  $fetch('/api/contents', {
    method: 'GET'
  }).then((data) => {
    contentsForSort.value = data.items
  })
}

// 並び替えダイアログを閉じる
const closeSortDialog = () => {
  sortDialog.value = false
}

// 言語の並び順を更新
const updateContentSort = async () => {
  $fetch(`/api/contents/sort`, {
    method: 'PUT',
    body: contentsForSort.value,
    watch: false
  }).then(() => {
    closeSortDialog()
    fetchContents({ page: 1, itemsPerPage: 10, sortBy: [] })
  })
}
</script>
