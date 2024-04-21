<template>
  <div>
    <div class="d-flex justify-end mb-3">
      <v-btn variant="outlined" prepend-icon="mdi-sort-numeric-descending" @click="openSortDialog">表示順を変更</v-btn>
      <v-btn variant="outlined" prepend-icon="mdi-table-plus" class="ml-4" @click="openNewDialog">言語を追加</v-btn>
    </div>
    <DataTable :headers="headers" :items="languages" :items-length="languageTotalLength" @update="fetchLanguages">
      <template #[`item.isValid`]="{ item }">
        {{ item.isValid ? '有効' : '無効' }}
      </template>
      <template #[`item.edit`]="{ item }">
        <v-icon @click="openEditDialog(item)">mdi-text-box-edit</v-icon>
      </template>
    </DataTable>

    <FormDialog
      v-model="formDialog"
      :mode="mode"
      title="言語"
      @click:register="registerLanguage"
      @click:update="updateLanguage"
      @click:delete="deleteLanguage"
    >
      <v-text-field v-model="languageForm.name" label="言語名" :error-messages="errorMsg?.name" class="mx-7 my-3" />
      <v-text-field
        v-model="languageForm.label"
        label="言語名（ラベル）"
        :error-messages="errorMsg?.label"
        class="mx-7 my-3"
      />
      <v-switch
        v-model="languageForm.isValid"
        color="primary"
        :label="languageForm.isValid ? '有効' : '無効'"
        class="mx-7"
      />
    </FormDialog>

    <v-dialog v-model="sortDialog" :max-width="1000" persistent>
      <v-card>
        <v-card-title>ドラッグアンドドロップで表示順を変更できます</v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-center">表示順</th>
                <th class="text-center">言語名</th>
                <th class="text-center">言語名（ラベル）</th>
                <th class="text-center">有効・無効</th>
              </tr>
            </thead>
            <draggable
              v-model="languagesForSort"
              tag="tbody"
              item-key="id"
              ghost-class="bg-blue-lighten-5"
              :animation="150"
            >
              <template #item="{ element }">
                <tr class="sortable-item">
                  <td class="text-center">{{ element.position }}</td>
                  <td class="text-left">{{ element.name }}</td>
                  <td class="text-left">{{ element.label }}</td>
                  <td class="text-center">{{ element.isValid ? '有効' : '無効' }}</td>
                </tr>
              </template>
            </draggable>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeSortDialog">キャンセル</v-btn>
          <v-spacer />
          <v-btn color="success" variant="tonal" @click="updateLanguageSort">更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type { DataTableHeader, Options } from '@/components/DataTable.vue'

const headers: DataTableHeader = [
  { title: '表示順', key: 'position', sortable: true, align: 'center', width: 120 },
  { title: '言語名', key: 'name', sortable: true, align: 'start', width: 500 },
  { title: '言語名（ラベル）', key: 'label', sortable: true, align: 'start', width: 500 },
  { title: '有効・無効', key: 'isValid', sortable: true, align: 'center', width: 150 },
  { title: '編集', key: 'edit', sortable: false, align: 'center', width: 80 }
]

const languageFormDefault: LanguageForm = {
  name: '',
  label: '',
  isValid: true
}

const languages = ref<Language[]>([])
const languageTotalLength = ref<number>(0)
const languageForm = ref<LanguageForm>(languageFormDefault)
const formDialog = ref<boolean>(false)
const mode = ref<FormDialogMode>('new')

const sortDialog = ref<boolean>(false)
const languagesForSort = ref<Language[]>([])
const errorMsg = ref()

// 言語情報一覧を取得
const fetchLanguages = async ({ page, itemsPerPage, sortBy }: Options) => {
  $fetch('/api/languages', {
    method: 'GET',
    params: {
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      sortKey: sortBy[0]?.key,
      sortOrder: sortBy[0]?.order
    }
  }).then((data) => {
    languages.value = data.items
    languageTotalLength.value = data.totalLength
  })
}

// ダイアログを表示（新規登録）
const openNewDialog = () => {
  languageForm.value.id = undefined
  languageForm.value.name = ''
  languageForm.value.label = ''
  languageForm.value.isValid = true
  errorMsg.value = {}
  mode.value = 'new'
  formDialog.value = true
}

// ダイアログを表示（編集）
const openEditDialog = (language: Language) => {
  languageForm.value.id = language.id
  languageForm.value.name = language.name
  languageForm.value.label = language.label
  languageForm.value.isValid = language.isValid
  errorMsg.value = {}
  mode.value = 'edit'
  formDialog.value = true
}

// ダイアログを閉じる
const closeFormDialog = () => {
  formDialog.value = false
}

// 言語情報を登録
const registerLanguage = async () => {
  $fetch('/api/languages', {
    method: 'POST',
    body: languageForm.value
  })
    .then(() => {
      closeFormDialog()
      fetchLanguages({ page: 1, itemsPerPage: 10, sortBy: [] })
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        errorMsg.value = error.data.data
      }
    })
}

// 言語情報を更新
const updateLanguage = async () => {
  const languageId = languageForm.value.id
  $fetch(`/api/languages/${languageId}`, {
    method: 'PUT',
    body: languageForm.value
  })
    .then(() => {
      closeFormDialog()
      fetchLanguages({ page: 1, itemsPerPage: 10, sortBy: [] })
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        errorMsg.value = error.data.data
      }
    })
}

// 言語情報を削除
const deleteLanguage = async () => {
  const languageId = languageForm.value.id
  $fetch(`/api/languages/${languageId}`, {
    method: 'DELETE'
  })
    .then(() => {
      closeFormDialog()
      fetchLanguages({ page: 1, itemsPerPage: 10, sortBy: [] })
    })
    .catch((error) => {
      console.log('エラー', error)
    })
}

// 並び替えダイアログを表示
const openSortDialog = async () => {
  sortDialog.value = true
  $fetch('/api/languages', {
    method: 'GET'
  }).then((data) => {
    languagesForSort.value = data.items
  })
}

// 並び替えダイアログを閉じる
const closeSortDialog = () => {
  sortDialog.value = false
}

// 言語の並び順を更新
const updateLanguageSort = async () => {
  $fetch(`/api/languages/sort`, {
    method: 'PUT',
    body: languagesForSort.value
  }).then(() => {
    closeSortDialog()
    fetchLanguages({ page: 1, itemsPerPage: 10, sortBy: [] })
  })
}
</script>
