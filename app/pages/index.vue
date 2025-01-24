<script setup lang="ts">
const vueError = () => {
  console.log(bob)
}
</script>

<template>
  <UPage>
    <UPageHeader title="fume.care test repo" />
    <UPageBody>
      <UButton label="Vue error" @click="vueError" />
    </UPageBody>
  </UPage>
</template>
