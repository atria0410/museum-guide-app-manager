<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field v-model="contentForm.name" label="コンテンツ名" />
      </v-col>
    </v-row>

    <!-- 画像ドロップゾーン -->
    <ImageDropZone :max-files="5" :max-file-size="1000000" @file-add="onFileAdd" />

    <!-- 言語毎の設定 -->
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
                <v-textarea v-model="contentForm.details[index].explanation" label="解説" :rows="10" />
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const contentFormDefault: ContentForm = {
  name: '',
  details: []
}

const contentForm = ref<ContentForm>(contentFormDefault)
const languages = ref<Language[]>([])
const languageTab = ref<number>(1)

const onFileAdd = (files: File[]) => {
  console.log(files)
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
        audioPath: ''
      })
    }
  })
}

onMounted(() => {
  fetchLanguages()
})
</script>
