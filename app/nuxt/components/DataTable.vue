<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :items-length="itemsLength"
    :page="page"
    :loading="loading"
    :loading-text="MESSAGES.LOADING_TEXT"
    :no-data-text="MESSAGES.NO_DATA_TEXT"
    :height="576"
    @update:options="fetchItems"
  >
    <template v-for="(_, name) in $slots as unknown" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
    <template #bottom>
      <v-pagination v-model="page" :length="Math.ceil(itemsLength / 10)" />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import type { VDataTableServer } from 'vuetify/components'

export type DataTableHeader = VDataTableServer['$props']['headers']
export type DataTableItems = VDataTableServer['$props']['items']
export type SortBy = {
  key: string
  order: string
}[]
export type Options = {
  page: number
  itemsPerPage: number
  sortBy: SortBy
}

interface Props {
  headers: DataTableHeader
  items: DataTableItems
  itemsLength: number
}

withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update'])

const loading = ref<boolean>(false)
const page = ref<number>(1)

const fetchItems = (options: Options) => {
  emit('update', options)
}
</script>
