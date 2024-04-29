<template>
  <div class="wrapper">
    <v-card class="login-form">
      <v-card-title class="text-center">ログイン</v-card-title>
      <v-card-text class="pa-3">
        <v-text-field
          v-model="loginForm.loginId"
          :error-messages="errorMsg.loginId"
          type="text"
          label="ログインID"
          prepend-inner-icon="mdi-account"
          class="mt-5"
        />
        <v-text-field
          v-model="loginForm.password"
          :error-messages="errorMsg.password"
          type="password"
          label="パスワード"
          prepend-inner-icon="mdi-lock"
          class="mt-6"
        />
      </v-card-text>
      <v-card-actions class="pa-3">
        <v-btn
          variant="flat"
          color="blue-accent-2"
          size="x-large"
          class="flex-grow-1"
          @click="login"
        >
          ログイン
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
// レイアウトを使用しない
definePageMeta({
  layout: false
})

// ログインフォーム
const loginForm = ref<LoginForm>({
  loginId: '',
  password: ''
})

// エラーメッセージ
const errorMsg = ref({
  loginId: '',
  password: ''
})

// ログイン処理
const login = () => {
  navigateTo('/')
}
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url('~/assets/img/museum.jpg');
  background-color: rgba(255, 255, 255, 0.3);
  background-blend-mode: lighten;
  background-size: cover;
  background-position: center;
}

.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 10px !important;
  width: 30vw;
}

@media screen and (max-width: 990px) {
  .login-form {
    width: 80vw;
  }
}
@media screen and (min-width: 991px) and (max-width: 1500px) {
  .login-form {
    width: 40vw;
  }
}
</style>
