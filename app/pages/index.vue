<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <UPage>
    <UPageHeader title="ajdone" description="example app showing off nuxt-auth-utils with nuxt-app-utils" />
    <UPageBody>
      <pre>
        {{ user }}
      </pre>
    </UPageBody>
  </UPage>
</template>
