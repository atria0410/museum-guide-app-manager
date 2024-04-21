<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field v-model="contentForm.name" label="コンテンツ名" />
      </v-col>
    </v-row>

    <!-- 言語毎の設定 -->
    <v-tabs v-model="languageTab" align-tabs="center">
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

// 言語情報一覧を取得
const fetchLanguages = async () => {
  const { data } = await useFetch('/api/languages', {
    method: 'GET',
    params: {
      sortKey: 'position',
      sortOrder: 'asc'
    },
    key: crypto.randomUUID()
  })

  if (data.value) {
    languages.value = data.value.items

    for (let i = 0; i < languages.value.length; i++) {
      contentForm.value.details.push({
        languageId: languages.value[i].id,
        title: '',
        explanation: '',
        audioPath: ''
      })
    }
  }
}

onMounted(() => {
  fetchLanguages()
})
</script>
