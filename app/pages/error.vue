<script setup lang="ts">
const variable = 'bob'
useCare().tag('page', 'errors')
const referenceErrorBob = () => console.log(bob)
const referenceErrorSuzy = () => console.log(suzy)
const nitroUserError = () => $fetch('/api/user')
const nitroNoUserError = () => $fetch('/api/nouser')
const test = () => console.log(variable.value)
</script>

<template>
  <UPage>
    <UPageHeader title="fume.care test repo" />
    <UPageBody>
      <div class="flex items-center space-x-2">
        <UButton label="referenceError(bob)" @click="referenceErrorBob" />
        <UButton label="referenceError(suzy)" @click="referenceErrorSuzy" />
        <UButton label="test()" @click="test" />
        <UButton label="nitroUserError()" @click="() => nitroUserError()" />
        <UButton label="nitroNoUserError()" @click="() => nitroNoUserError()" />
      </div>
    </UPageBody>
  </UPage>
</template>
