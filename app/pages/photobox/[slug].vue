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
          @click="isNewUserModalOpen = true"
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
        v-for="image in sortedImages"
        :key="image.id"
        class="w-full aspect-square mb-4 relative group"
      >
        <img
          :src="image.path"
          alt="img path"
          class="w-full aspect-square"
          :class="{ 'opacity-50': selectedImages.includes(image.id) }"
        >
        <div class="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <UCheckbox
            v-model="selectedImages"
            :value="image.id"
            color="primary"
          />
          <UButton
            :icon="image.isPinned ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
            :color="image.isPinned ? 'yellow' : 'white'"
            variant="solid"
            size="xs"
            @click="togglePinImage(image.id)"
          />
        </div>
      </div>
    </div>
    <UModal
      v-model="isNewUserModalOpen"
      title="New user"
      description="Add a new user to your database"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxImagesForm @close="isNewUserModalOpen = false" />
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
const { data, refresh } = await useFetch(`/api/categories/${route.params.slug}`)
if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
}

const images = ref(data.value.images)
const categoryName = ref(data.value.name)
const categoryId = ref(data.value.id)
const links = computed(() => [{
  label: 'Photobox',
  to: '/photobox'
}, {
  label: categoryName.value.toUpperCase()
}])
const isNewUserModalOpen = ref(false)
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
</script>
