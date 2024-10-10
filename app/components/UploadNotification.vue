<template>
  <div
    v-if="uploadStore.isUploading"
    class="fixed bottom-4 right-4 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50"
  >
    <p class="text-sm font-semibold mb-2 dark:text-white">
      Ajout en cours...
    </p>
    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
      <div
        class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        :style="{ width: `${uploadStore.uploadProgress}%` }"
      />
    </div>
    <p class="text-xs mt-1 text-right dark:text-gray-300">
      {{ Math.round(uploadStore.uploadProgress) }}% ({{ uploadStore.uploadedImages }} sur {{ uploadStore.totalImages }} images uploadées)
    </p>
  </div>
</template>

<script setup lang="ts">
import { useUploadStore } from '~/stores/uploadStore'

const uploadStore = useUploadStore()
</script>
