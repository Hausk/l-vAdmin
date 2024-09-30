<template>
  <nuxt-ui-modal
    v-model="isOpen"
    title="Uploader des images"
  >
    <div class="p-4">
      <input
        type="file"
        multiple
        @change="handleFileChange"
      >
      <div class="mt-4 grid grid-cols-3 gap-4">
        <div
          v-for="(file, index) in previewImages"
          :key="index"
          class="relative"
        >
          <img
            :src="file"
            alt="Preview"
            class="w-full h-auto rounded"
          >
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <nuxt-ui-button
          :disabled="!selectedFiles.length"
          @click="uploadImages"
        >
          Sauvegarder
        </nuxt-ui-button>
      </div>
    </div>
  </nuxt-ui-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
  onUploadSuccess: Function
})

const selectedFiles = ref<File[]>([])
const previewImages = ref<string[]>([])

const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    selectedFiles.value = Array.from(files)
    previewImages.value = selectedFiles.value.map(file => URL.createObjectURL(file))
  }
}

const uploadImages = async () => {
  const formData = new FormData()
  selectedFiles.value.forEach(file => formData.append('files', file))

  const response = await $fetch('/api/images', formData, {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  props.onUploadSuccess(response.images)
  props.onClose()
}
</script>
