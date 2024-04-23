import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
    ssr: true,
    defaults: {
      VTextField: {
        variant: 'outlined'
      },
      VTextarea: {
        variant: 'outlined'
      }
    }
  })
  app.vueApp.use(vuetify)
})
