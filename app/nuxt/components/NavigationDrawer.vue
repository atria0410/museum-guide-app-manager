<template>
  <v-navigation-drawer :rail="rail" color="grey-darken-3" @click="rail = false">
    <v-list-item class="px-1">
      <v-btn :icon="icon" variant="text" @click.stop="rail = !rail" />
    </v-list-item>

    <v-list nav>
      <v-list-item prepend-icon="mdi-home" title="ホーム" value="home" to="/" />
      <v-list-item prepend-icon="mdi-image-edit" title="コンテンツ管理" value="contents" to="/contents" />
      <v-list-item prepend-icon="mdi-translate-variant" title="言語管理" value="languages" to="/languages" />
      <v-list-item prepend-icon="mdi-account-cog" title="アカウント管理" value="accounts" to="/accounts" />
      <v-list-item prepend-icon="mdi-file-document" title="マニュアル" value="manual" to="/manual" />
      <v-list-item prepend-icon="mdi-cog" title="システム設定" value="config" to="/config" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const rail = ref<boolean>(true)
const icon = computed(() => (rail.value ? 'mdi-chevron-right' : 'mdi-chevron-left'))
</script>
