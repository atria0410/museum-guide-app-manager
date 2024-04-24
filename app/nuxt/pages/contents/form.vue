<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field v-model="contentForm.name" :error-messages="errorMsg.name" label="コンテンツ名" />
      </v-col>
    </v-row>

    <!-- 画像ドロップゾーン -->
    <v-row>
      <v-col>
        <ImageDropZone :max-files="5" :max-file-size="1000000" @file-add="onFileAdd" @file-remove="onFileRemove" />
      </v-col>
    </v-row>

    <!-- 言語毎の設定 -->
    <v-row>
      <v-col>
        <v-card variant="outlined" class="mt-5">
          <v-tabs v-model="languageTab" bg-color="grey-lighten-3">
            <v-tab v-for="language in languages" :key="language.id" :value="language.id">
              {{ language.name }}
            </v-tab>
          </v-tabs>
          <v-window v-model="languageTab">
            <v-window-item v-for="(language, index) in languages" :key="language.id" :value="language.id">
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-text-field v-model="contentForm.details[index].title" label="タイトル" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-textarea v-model="contentForm.details[index].explanation" label="解説" :rows="5" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-file-input
                      label="音声ファイル（MPEG）"
                      accept="audio/mpeg"
                      @change="audioChange($event, index)"
                      @click:clear="audioClear(index)"
                    />
                    <template v-if="contentForm.details[index].audioFile">
                      <audio controls :src="contentForm.details[index].audioFile" />
                    </template>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn @click="registerContent">登録</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const contentFormDefault: ContentForm = {
  name: '',
  isRecommend: true,
  isPublic: true,
  details: [],
  images: []
}

const contentForm = ref<ContentForm>(contentFormDefault)
const images = ref<{ id: string; file: File }[]>([])
const languages = ref<Language[]>([])
const languageTab = ref<number>(1)
const errorMsg = ref({ name: '' })

// ファイル追加
const onFileAdd = async (item: { id: string; file: File }) => {
  images.value.push(item)
  const base64 = await fileToBase64(item.file)
  contentForm.value.images.push(base64)
}

// ファイル削除
const onFileRemove = (item: { id: string; status: 'DONE' | 'ERROR' | 'QUEUE'; file: File }) => {
  const index = images.value.findIndex((image) => image.id !== item.id)
  images.value.splice(index, 1)
  contentForm.value.images.splice(index, 1)
}

// 音声ファイル変更
const audioChange = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    contentForm.value.details[index].audioFile = await fileToBase64(input.files[0])
  } else {
    // Chromiumブラウザの場合、ファイル選択をキャンセルすると選択状態が解除される
    contentForm.value.details[index].audioFile = undefined
  }
}

// 音声ファイルクリア
const audioClear = (index: number) => {
  contentForm.value.details[index].audioFile = undefined
}

// 言語情報一覧を取得
const fetchLanguages = async () => {
  $fetch('/api/languages', {
    method: 'GET',
    params: {
      sortKey: 'position',
      sortOrder: 'asc'
    },
    key: crypto.randomUUID()
  }).then((data) => {
    languages.value = data.items

    for (let i = 0; i < languages.value.length; i++) {
      contentForm.value.details.push({
        languageId: languages.value[i].id,
        title: '',
        explanation: '',
        audioFile: ''
      })
    }
  })
}

// コンテンツ登録
const registerContent = async () => {
  $fetch('/api/contents', {
    method: 'POST',
    body: contentForm.value
  })
    .then(() => {
      navigateTo('/contents')
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        errorMsg.value = error.data.data
      }
    })
}

onMounted(() => {
  fetchLanguages()
})
</script>

<style scoped lang="scss">
audio {
  width: 100%;
}
</style>
