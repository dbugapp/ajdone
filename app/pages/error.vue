<script setup lang="ts">
const variable = 'bob'
useDbug().tag('page', 'errors')
useDbug().tag('project', 'ajdone')
const referenceErrorBob = () => console.log(bob)
const referenceErrorSuzy = () => console.log(suzy)
const nitroUserError = () => $fetch('/api/user')
const nitroNoUserError = () => $fetch('/api/nouser')
const fourHundredError = () => navigateTo('/pwoejrpowerj')
const test = () => console.log(variable.value)
</script>

<template>
  <UPage>
    <UPageHeader title="fume.care test repo" />
    <UPageBody>
      <div class="flex items-center space-x-2">
        <UButton label="404" @click="fourHundredError" />
        <UButton label="referenceError(bob)" @click="referenceErrorBob" />
        <UButton label="referenceError(suzy)" @click="referenceErrorSuzy" />
        <UButton label="test()" @click="test" />
        <UButton label="nitroUserError()" @click="() => { nitroUserError() }" />
        <UButton label="nitroNoUserError()" @click="() => { nitroNoUserError() }" />
      </div>
    </UPageBody>
  </UPage>
</template>
