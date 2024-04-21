import DropZone from 'dropzone-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('DropZone', DropZone)
})
