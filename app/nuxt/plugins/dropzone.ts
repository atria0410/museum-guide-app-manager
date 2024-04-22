import DropZone from 'dropzone-vue'
import 'dropzone-vue/dist/dropzone-vue.common.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('DropZone', DropZone)
})
