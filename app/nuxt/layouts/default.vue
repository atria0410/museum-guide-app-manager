<template>
  <v-layout>
    <NavigationDrawer />
    <AppBar />
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>
