<template>
  <div class="w-full">
    <Navbar @toggle-sidebar="toggleSidebar">
      <template #breadcrumb>
        <UBreadcrumb
          divider="/"
          :links="[{ label: 'Photobox' }]"
          class="my-auto"
        />
      </template>

      <template #action-button>
        <UButton
          label="Ajout d'une catégorie"
          trailing-icon="ic:baseline-plus"
          color="primary"
          class="hidden md:flex"
          @click="isModalOpen = true"
        />
        <UButton
          icon="ic:baseline-plus"
          color="primary"
          class="flex md:hidden"
          @click="isModalOpen = true"
        />
      </template>
    </Navbar>

    <div
      ref="container"
      class="grid gap-4 p-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(category, index) in categories"
        :key="index"
        :data-swapy-slot="index"
        class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden aspect-square max-h-[45vh]"
      >
        <div
          class="relative h-full w-full"
          :data-swapy-item="index"
        >
          <NuxtLink
            :to="`/photobox/${category.slug}`"
            class="absolute inset-0 z-10"
          />
          <div class="w-full h-full relative overflow-hidden flex justify-center">
            <img
              v-if="category.pinnedImage?.path"
              :src="category.pinnedImage.path"
              :alt="category.name"
              class="relative object-cover m-auto"
            >
            <div
              v-else
              class=" w-full h-full bg-gray-800 flex items-center justify-center text-white text-sm"
            >
              <p>Aucune image épinglée</p>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-black to-transparent p-2">
            <p class="text-sm font-semibold">
              {{ category.name }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <UModal
      v-model="isModalOpen"
      title="Nouvelle catégorie"
      description="Ajoutez une nouvelle catégorie à votre Photobox"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxCategoriesForm
        @close="isModalOpen = false"
        @images-uploaded="handleImagesUploaded"
      />
    </UModal>
    <UploadNotification />
  </div>
</template>

<script setup lang="ts">
import { useUploadStore } from '~/stores/uploadStore'

const { data: categories, refresh } = await useFetch('/api/categories')
const isModalOpen = ref(false)
const uploadStore = useUploadStore()
const handleImagesUploaded = async () => {
  await refresh()
}

const toggleSidebar = () => {
  // Logique pour basculer la barre latérale
}
watch(() => uploadStore.isUploading, (newValue) => {
  if (!newValue) {
    refresh()
  }
})
</script>
