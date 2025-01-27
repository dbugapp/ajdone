<script setup lang="ts">
const referenceErrorBob = () => console.log(bob)
const referenceErrorSuzy = () => console.log(suzy)
const nitroUserError = () => $fetch('/api/user')
</script>

<template>
  <UPage>
    <UPageHeader title="fume.care test repo" />
    <UPageBody>
      <div class="flex items-center space-x-2">
        <UButton label="referenceError(bob)" @click="referenceErrorBob" />
        <UButton label="referenceError(suzy)" @click="referenceErrorSuzy" />
        <UButton label="nitroUserError()" @click="() => nitroUserError()" />
      </div>
    </UPageBody>
  </UPage>
</template>
