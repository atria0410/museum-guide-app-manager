<template>
  <v-navigation-drawer :rail="rail" color="grey-darken-3" @click="rail = false">
    <v-list-item class="px-1">
      <v-btn :icon="icon" variant="text" @click.stop="rail = !rail" />
    </v-list-item>

    <v-list nav>
      <v-list-item
        v-for="(menu, index) in menuList"
        :key="index"
        :title="menu.title"
        :prepend-icon="menu.icon"
        :to="menu.to"
        :value="index"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const rail = ref<boolean>(true)
const icon = computed(() => (rail.value ? 'mdi-chevron-right' : 'mdi-chevron-left'))

const menuList = [
  { title: 'ホーム', icon: 'mdi-home', to: '/' },
  { title: 'コンテンツ管理', icon: 'mdi-image-edit', to: '/contents' },
  { title: '言語管理', icon: 'mdi-translate-variant', to: '/languages' },
  { title: 'ユーザー管理', icon: 'mdi-account-cog', to: '/users' },
  { title: 'マニュアル', icon: 'mdi-file-document', to: '/manual' },
  { title: 'システム設定', icon: 'mdi-cog', to: '/config' }
]
</script>
