<template>
  <v-dialog v-model="dialog" persistent :max-width="maxWidth">
    <v-card>
      <v-card-title class="mb-5">{{ title }}{{ mode === 'new' ? '登録' : '編集' }}</v-card-title>
      <slot />
      <v-divider />
      <v-card-actions>
        <v-btn @click="closeDialog">キャンセル</v-btn>
        <v-spacer />
        <template v-if="mode === 'new'">
          <v-btn color="success" variant="tonal" @click="emit('click:register')">登録</v-btn>
        </template>
        <template v-else>
          <v-btn color="success" variant="tonal" @click="emit('click:update')">更新</v-btn>
          <v-btn color="red" variant="tonal" @click="emit('click:delete')">削除</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  mode: FormDialogMode
  title?: string
  maxWidth?: number
}

withDefaults(defineProps<Props>(), {
  title: '',
  maxWidth: 600
})

const dialog = defineModel<boolean>()

const emit = defineEmits(['click:register', 'click:update', 'click:delete'])

const closeDialog = () => {
  dialog.value = false
}
</script>
