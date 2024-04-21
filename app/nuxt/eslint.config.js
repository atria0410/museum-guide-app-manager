import withNuxt from './.nuxt/eslint.config.mjs'
import pluginPrettier from 'eslint-config-prettier'

export default withNuxt(
  {
    files: ['**/*.vue', '**/*.ts'],
    rules: {
      ...pluginPrettier.rules,
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'error',
      'vue/require-v-for-key': 'error',
      'vue/no-use-v-if-with-v-for': 'error'
    }
  }
)
