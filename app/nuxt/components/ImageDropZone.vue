<template>
  <ClientOnly>
    <DropZone
      :max-files="maxFiles"
      :max-file-size="maxFileSize"
      :accepted-files="['bmp', 'png', 'jpeg']"
      :multiple-upload="true"
      :parallel-upload="3"
      :upload-on-drop="false"
      @added-file="onFileAdd"
      @removed-file="onFileRemove"
    >
      <template #message>
        画像ファイルを選択してください
        <br />
        （bmp, jpeg, png）
      </template>
    </DropZone>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  maxFiles?: number
  maxFileSize?: number
}

withDefaults(defineProps<Props>(), {
  maxFiles: 5,
  maxFileSize: 1000000
})

const emit = defineEmits(['fileAdd', 'fileRemove'])

const onFileAdd = (item: { id: string; file: File }) => {
  emit('fileAdd', item)
}

const onFileRemove = (item: { id: string; status: 'DONE' | 'ERROR' | 'QUEUE'; file: File }) => {
  emit('fileRemove', item)
}
</script>

<style lang="scss">
.dropzone__box {
  height: 150px;
  border: 2px dashed #5c5c5c;
  .dropzone__message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  .dropzone__item {
    .dropzone__progress {
      display: none;
    }
  }
}
</style>
