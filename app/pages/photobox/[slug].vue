<template>
  <div class="w-full h-screen">
    <div class="h-14 lg:border-b border-gray-200 dark:border-gray-800 flex px-5 justify-between">
      <UBreadcrumb
        divider="/"
        :links="links"
        class="my-auto"
      />

      <div class="button-group my-auto flex space-x-2">
        <UButton
          label="Ajout d'images"
          trailing-icon="ic:baseline-plus"
          color="gray"
          class="hidden md:flex"
          @click="isModalOpen = true"
        />
        <UButton
          icon="ic:baseline-plus"
          color="gray"
          class="flex md:hidden"
          @click="isModalOpen = true"
        />
        <UButton
          v-if="selectedImages.length > 0"
          label="Supprimer sélection"
          icon="i-heroicons-trash"
          color="red"
          @click="deleteSelectedImages"
        />
        <UButton
          label="Supprimer catégorie"
          icon="i-heroicons-trash"
          color="red"
          class="hidden md:flex"
          @click="confirmDeleteCategory"
        />
        <UButton
          icon="i-heroicons-trash"
          color="red"
          class="flex md:hidden"
          @click="confirmDeleteCategory"
        />
      </div>
    </div>
    <div
      class="
        w-full
        columns-3-xsw-full
        md:columns-4
        columns-2
        p-5"
    >
      <div
        v-if="isUploading"
        class="w-full mb-4"
      >
        <p>Upload en cours : {{ uploadProgress.toFixed(2) }}%</p>
        <div
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
      <div
        v-for="image in sortedImages"
        :key="image.id"
        class="w-full aspect-square mb-4 relative group"
      >
        <img
          :src="image.path"
          alt="img path"
          class="w-full aspect-square object-cover"
          :class="{ 'opacity-50': selectedImages.includes(image.id) }"
        >
        <div class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <UCheckbox
            v-model="selectedImages"
            :value="image.id"
            color="primary"
          />
          <UButton
            :icon="pinnedImageId == image.id ? 'material-symbols:star' : 'material-symbols:star-outline' "
            color="white"
            :style="pinnedImageId == image.id ? 'color:yellow' : 'color:white'"
            variant="solid"
            size="xs"
            @click="togglePinImage(image.id)"
          />
        </div>
      </div>
    </div>
    <UModal
      v-model="isModalOpen"
      title="Ajout d'images"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxImagesForm
        :category-id="categoryId"
        @close="handleModalClose"
        @images-uploaded="handleImagesUploaded"
        @upload-status="handleUploadStatus"
      />
    </UModal>
    <UModal v-model="isDeleteCategoryModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Confirmer la suppression
            </h3>
          </div>
        </template>
        <p>Êtes-vous sûr de vouloir supprimer cette catégorie et toutes ses images associées ? Cette action est irréversible.</p>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              color="gray"
              @click="isDeleteCategoryModalOpen = false"
            >
              Annuler
            </UButton>
            <UButton
              color="red"
              @click="deleteCategory"
            >
              Supprimer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const showNotification = ref(false)
const { data, refresh } = await useFetch(`/api/categories/${route.params.slug}`)
const isUploading = ref(false)
const uploadProgress = ref(0)
const pinnedImageId = ref(data.value.pinnedImageId)

const handleModalClose = () => {
  isModalOpen.value = false
  // Ne pas réinitialiser isUploading et uploadProgress ici
}

const handleUploadStatus = (progress: number) => {
  isUploading.value = true
  uploadProgress.value = progress
  if (progress === 100) {
    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0
    }, 1000) // Garde la barre visible pendant 1 seconde après la fin
  }
}
if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
}

const images = ref(data.value.images)
const PinnedImage = ref(data.value.pinnedImage)
const categoryName = ref(data.value.name)
const categoryId = ref(data.value.id)
const links = computed(() => [{
  label: 'Photobox',
  to: '/photobox'
}, {
  label: categoryName.value.toUpperCase()
}])
const isModalOpen = ref(false)
const isDeleteCategoryModalOpen = ref(false)
const selectedImages = ref<number[]>([])

const sortedImages = computed(() => {
  return [...images.value].sort((a, b) => {
    if (a.id === data.value.pinnedImageId) return -1
    if (b.id === data.value.pinnedImageId) return 1
    return 0
  })
})

const togglePinImage = async (imageId: number) => {
  try {
    const response = await $fetch(`/api/categories/pin-image/${categoryId.value}`, {
      method: 'POST',
      body: { imageId }
    })
    if (response.success) {
      await refresh()
    }
  } catch (error) {
    console.error('Error pinning image:', error)
    // Handle error (e.g., show error message to user)
  }
}

const deleteSelectedImages = async () => {
  try {
    await $fetch(`/api/images/bulk-delete`, {
      method: 'POST',
      body: { imageIds: selectedImages.value }
    })
    images.value = images.value.filter(img => !selectedImages.value.includes(img.id))
    selectedImages.value = []
  } catch (error) {
    console.error('Error deleting images:', error)
    // Handle error (e.g., show error message to user)
  }
}

const confirmDeleteCategory = () => {
  isDeleteCategoryModalOpen.value = true
}

const deleteCategory = async () => {
  try {
    await $fetch(`/api/categories/${categoryId.value}`, {
      method: 'DELETE'
    })
    router.push('/photobox')
  } catch (error) {
    console.error('Error deleting category:', error)
    // Handle error (e.g., show error message to user)
  }
  isDeleteCategoryModalOpen.value = false
}

const handleImagesUploaded = async (newImages: any[]) => {
  images.value = [...images.value, ...newImages]
  await refresh()
  showNotification.value = true
  isUploading.value = false
  uploadProgress.value = 0
}
</script>
