<script lang="ts" setup>
const { loggedIn, user, clear } = useUserSession()
const logout = async () => {
  await $fetch('/api/logout')
  clear()
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <UHeader>
      <template #left>
        AJDONE
      </template>
      <template #right>
        <UButton
          v-if="!loggedIn"
          icon="i-mdi-github"
          label="Login with GitHub"
          @click="async () => await navigateTo('/api/oauth/google', { external: true })"
        />
        <UButton
          v-else-if="user"
          :avatar="{
            src: user.avatar,
            alt: user.name,
          }"
          label="Logout"
          @click="logout"
        />
      </template>
    </UHeader>
    <UContainer>
      <NuxtPage />
    </UContainer>
  </UApp>
</template>
