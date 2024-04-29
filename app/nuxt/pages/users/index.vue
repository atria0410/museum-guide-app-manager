<template>
  <v-container>
    <div class="d-flex justify-end mb-3">
      <v-btn variant="outlined" prepend-icon="mdi-table-plus" class="ml-4" @click="openNewDialog">
        ユーザーを追加
      </v-btn>
    </div>
    <DataTable
      :headers="headers"
      :items="users"
      :items-length="userTotalLength"
      @update="fetchUsers"
    >
      <template #[`item.name`]="{ item }">
        {{ `${item.lastName} ${item.firstName}` }}
      </template>
      <template #[`item.isAdmin`]="{ item }">
        {{ item.isAdmin ? '〇' : '' }}
      </template>
      <template #[`item.edit`]="{ item }">
        <v-icon @click="openEditDialog(item)">mdi-text-box-edit</v-icon>
      </template>
    </DataTable>

    <FormDialog
      v-model="formDialog"
      :mode="mode"
      title="言語"
      @click:register="registerUser"
      @click:update="updateUser"
      @click:delete="deleteUser"
    >
      <v-row>
        <v-col>
          <v-text-field
            v-model="userForm.lastName"
            :error-messages="userFormError.lastName"
            :disabled="userForm.loginId === 'root'"
            label="苗字"
            class="mx-7 my-3"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="userForm.firstName"
            :error-messages="userFormError.firstName"
            :disabled="userForm.loginId === 'root'"
            label="名前"
            class="mx-7 my-3"
          />
        </v-col>
      </v-row>
      <v-file-input
        label="アイコン"
        accept="image/bmp, image/png, image/jpeg"
        class="mx-7 my-3"
        @change="iconChange($event)"
        @click:clear="iconClear()"
      />
      <v-text-field
        v-model="userForm.loginId"
        :error-messages="userFormError.loginId"
        :disabled="userForm.loginId === 'root'"
        label="ログインID"
        class="mx-7 my-3"
      />
      <v-text-field
        v-model="userForm.password"
        :error-messages="userFormError.password"
        label="パスワード"
        type="password"
        class="mx-7 my-3"
      />
      <v-text-field
        v-model="userForm.passwordConfirmation"
        :error-messages="userFormError.passwordConfirmation"
        label="パスワード（確認）"
        type="password"
        class="mx-7 my-3"
      />
      <v-checkbox v-model="userForm.isAdmin" label="管理者" color="primary" class="mx-7" />
    </FormDialog>
  </v-container>
</template>

<script setup lang="ts">
import type { DataTableHeader, Options } from '@/components/DataTable.vue'

// ヘッダー
const headers: DataTableHeader = [
  { title: '名前', key: 'name', sortable: true, align: 'start', width: 120 },
  { title: 'ログインID', key: 'loginId', sortable: true, align: 'start', width: 120 },
  { title: '管理者', key: 'isAdmin', sortable: true, align: 'center', width: 150 },
  { title: '編集', key: 'edit', sortable: false, align: 'center', width: 80 }
]

// ユーザーフォーム
const userFormDefault: UserForm = {
  id: undefined,
  lastName: '',
  firstName: '',
  icon: '',
  loginId: '',
  password: '',
  passwordConfirmation: '',
  isAdmin: false
}

// ユーザーフォームのエラーメッセージ
const userFormErrorDefault: UserFormError = {
  lastName: '',
  firstName: '',
  loginId: '',
  password: '',
  passwordConfirmation: '',
  icon: ''
}

const users = ref<User[]>([])
const userTotalLength = ref<number>(0)
const formDialog = ref<boolean>(false)
const mode = ref<FormDialogMode>('new')
const userForm = ref<UserForm>({ ...userFormDefault })
const userFormError = ref<UserFormError>({ ...userFormErrorDefault })

// 言語情報一覧を取得
const fetchUsers = async ({ page, itemsPerPage, sortBy }: Options) => {
  $fetch('/api/users', {
    method: 'GET',
    params: {
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      sortKey: sortBy[0]?.key,
      sortOrder: sortBy[0]?.order
    }
  }).then((data) => {
    users.value = data.items
    userTotalLength.value = data.totalLength
  })
}

// アイコン画像ファイル変更
const iconChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    userForm.value.icon = await fileToBase64(input.files[0])
  } else {
    // Chromiumブラウザの場合、ファイル選択をキャンセルすると選択状態が解除される
    userForm.value.icon = undefined
  }
}

const iconClear = () => {
  userForm.value.icon = undefined
}

// ダイアログを表示（新規登録）
const openNewDialog = () => {
  userForm.value = { ...userFormDefault }
  userFormError.value = { ...userFormErrorDefault }
  mode.value = 'new'
  formDialog.value = true
}

// ダイアログを表示（編集）
const openEditDialog = (user: User) => {
  userForm.value.id = user.id
  userForm.value.lastName = user.lastName
  userForm.value.firstName = user.firstName
  userForm.value.loginId = user.loginId
  userForm.value.password = ''
  userForm.value.passwordConfirmation = ''
  userForm.value.isAdmin = user.isAdmin
  userFormError.value = { ...userFormErrorDefault }
  mode.value = 'edit'
  formDialog.value = true
}

// ダイアログを閉じる
const closeFormDialog = () => {
  formDialog.value = false
}

// ユーザー情報を登録
const registerUser = async () => {
  $fetch('/api/users', {
    method: 'POST',
    body: userForm.value
  })
    .then(() => {
      closeFormDialog()
      fetchUsers({ page: 1, itemsPerPage: 10, sortBy: [] })
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        userFormError.value = error.data.data
      }
    })
}

// ユーザー情報を更新
const updateUser = async () => {
  const languageId = userForm.value.id
  $fetch(`/api/users/${languageId}`, {
    method: 'PUT',
    body: userForm.value
  })
    .then(() => {
      closeFormDialog()
      fetchUsers({ page: 1, itemsPerPage: 10, sortBy: [] })
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        userFormError.value = error.data.data
      }
    })
}

// ユーザー情報を削除
const deleteUser = async () => {
  const userId = userForm.value.id

  // ルートユーザーは削除させない
  if (userForm.value.loginId === 'root') {
    return
  }

  $fetch(`/api/users/${userId}`, {
    method: 'DELETE'
  })
    .then(() => {
      closeFormDialog()
      fetchUsers({ page: 1, itemsPerPage: 10, sortBy: [] })
    })
    .catch(() => {
      // TODO:エラーハンドリング
    })
}
</script>
