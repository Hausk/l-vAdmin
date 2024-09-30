<!-- components/ImageList.vue -->
<template>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="image in images"
      :key="image.id"
      class="relative"
    >
      <img
        :src="image.url"
        alt="Image"
        class="w-full h-auto rounded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  images: Array<{ id: number, url: string }>
}>()
</script>
