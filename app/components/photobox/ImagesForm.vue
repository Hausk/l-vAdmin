<script setup lang="ts">
import { ref } from 'vue'
import { useUploadStore } from '~/stores/uploadStore'

interface Image {
  id: string
  name: string
  url: string
  visible: boolean
  file: File
}

const props = defineProps<{
  categoryId: number
}>()
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 Mo en octets

const images = ref<Image[]>([])
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const emit = defineEmits(['close', 'images-uploaded'])

const handleFiles = (files: File[]) => {
  const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE)

  if (invalidFiles.length > 0) {
    alert(`Les fichiers suivants sont trop volumineux (max 10 Mo) et ne seront pas ajoutés:\n${invalidFiles.map(f => f.name).join('\n')}`)
  }
  const newImages = files.filter(file => !images.value.some(img => img.name === file.name))
    .map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      visible: false,
      file: file
    }))
  if (newImages.length > 0) {
    images.value.push(...newImages)
    animateImages()
  } else {
    alert('Toutes les images sélectionnées existent déjà dans la prévisualisation.')
  }
}
const animateImages = () => {
  images.value.forEach((image, index) => {
    setTimeout(() => {
      image.visible = true
    }, (images.value.length - index) * 50)
  })
}
const removeImage = (id: string) => {
  const index = images.value.findIndex(img => img.id === id)
  if (index !== -1) {
    images.value.splice(index, 1)
  }
}

const onFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    handleFiles(Array.from(input.files))
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer?.files) {
    handleFiles(Array.from(event.dataTransfer.files))
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const onDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const openFileSelector = () => {
  fileInputRef.value?.click()
}

const uploadStore = useUploadStore()

const uploadImages = async () => {
  uploadStore.startUpload(images.value.length)
  try {
    for (let i = 0; i < images.value.length; i++) {
      const image = images.value[i]
      const formData = new FormData()
      formData.append('file', image.file)
      formData.append('categoryId', props.categoryId.toString())

      try {
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Update progress
        uploadStore.updateProgress(i + 1)
      } catch (error) {
        console.error(`Error uploading image ${image.name}:`, error)
      }
    }
    uploadStore.finishUpload()
    emit('images-uploaded')
  } catch (error) {
    console.error('Error uploading images:', error)
    uploadStore.finishUpload()
  }
}

const onSubmit = async () => {
  console.log('Oui')
  await uploadImages()
  emit('close')
}
const onCancel = () => {
  images.value = []
  emit('close')
}
</script>

<template>
  <div class="p-5">
    <form
      class="space-y-4 mb-5"
      @submit="onSubmit"
    >
      <div
        class="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-4 cursor-pointer"
        :class="{ 'bg-gray-100': isDragging }"
        @drop="onDrop"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @click="openFileSelector"
      >
        <p
          v-if="isDragging"
          class="text-xl text-gray-600"
        >
          Lâche ici tes photos
        </p>
        <p
          v-else
          class="text-xl text-gray-500"
        >
          J'attends tes photos ici
        </p>
        <p class="mt-2 text-sm text-gray-400">
          {{ images.length }} image(s) en attente
        </p>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept=".jpg, .jpeg, .png, .gif"
        multiple
        class="hidden"
        @change="onFileInputChange"
      >
      <div class="w-full max-h-[50vh] overflow-y-auto overflow-x-hidden">
        <div class="w-full columns-3">
          <div
            v-for="image in images"
            :key="image.id"
            class="mb-4 transition-opacity duration-300 ease-in-out relative group"
            :class="{ 'opacity-0': !image.visible, 'opacity-100': image.visible }"
          >
            <img
              :src="image.url"
              :alt="image.name"
              class="w-full aspect-square rounded-lg object-cover"
            >
            <button
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              @click="removeImage(image.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <UButton
          label="Annuler"
          color="gray"
          variant="ghost"
          @click="onCancel"
        />
        <UButton
          type="submit"
          label="Valider"
          color="black"
          @click="onSubmit"
        />
      </div>
    </form>
  </div>
</template>
