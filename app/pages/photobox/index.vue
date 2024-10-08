<template>
  <div class="">
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
      </template>
    </Navbar>
    <div
      ref="container"
      class="gap-4 w-full p-4 columns-3-xsw-full md:columns-4 columns-2"
    >
      <div
        v-for="(category, index) in categories"
        :key="index"
        :data-swapy-slot="index"
        class="dark:bg-gray-700 bg-gray-400 border border-gray-50 rounded-md aspect-square w-full"
      >
        <div
          class="item a w-full h-full overflow-hidden relative dark:bg-gray-800 bg-gray-300 rounded-md"
          :data-swapy-item="index"
        >
          <NuxtLink
            :to="'photobox/' + category.slug"
            class="w-full h-full absolute top-0 bg-transparent z-10"
          />
          <svg
            class="absolute inset-0 h-10 w-full top-0 z-20 stroke-gray-900/10 bg-gray-900 dark:bg-white/10 dark:stroke-white/10 hidden md:block"
            fill="none"
          >
            <defs><pattern
              id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            ><path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" /></pattern></defs>
            <rect
              stroke="none"
              fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)"
              width="100%"
              height="100%"
            />
          </svg>
          <img :src="category.pinnedImage?.path">
          <p class="absolute bottom-0">
            {{ category.name }}
          </p>
        </div>
      </div>
    </div>
    <UModal
      v-model="isModalOpen"
      title="New user"
      description="Add a new user to your database"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <PhotoboxCategoriesForm
        @close="isModalOpen = false"
        @images-uploaded="handleImagesUploaded"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createSwapy } from 'swapy'
import { useNuxtApp } from '#app'

const { data: categories, refresh } = await useFetch('/api/categories')
const isModalOpen = ref(false)
const handleImagesUploaded = async () => {
  await refresh()
}
const toggleSidebar = () => {
  // LOGIQUE
}

const DEFAULT = {
  1: 'a',
  3: 'c',
  4: 'd',
  2: null
} as const
const nuxtApp = useNuxtApp()
const isClient = computed(() => nuxtApp.isHydrating || import.meta.client)
const slotItems = ref(DEFAULT)

const container = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (isClient.value) {
    const storedItems = localStorage.getItem('slotItem')
    if (storedItems) {
      slotItems.value = JSON.parse(storedItems)
    }

    if (container.value) {
      const swapy = createSwapy(container.value)
      swapy.onSwap(({ data }) => {
        localStorage.setItem('slotItem', JSON.stringify(data.object))
      })
    }
  }
})
</script>

<style lang="css">
.item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  position: relative;
}

.enable-input {
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;
}
</style>
