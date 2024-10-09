<!-- Navbar.vue -->
<script setup>
import { defineEmits, ref } from 'vue'

const route = useRoute()

const emit = defineEmits(['toggle-sidebar'])
console.log(route.path.startsWith('/photobox'))
const isSidebarOpen = ref(true)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  emit('toggle-sidebar')
}
const links = [{
  name: 'Statistiques',
  link: '/'
},
{
  name: 'Photobox',
  link: '/photobox'
},
{
  name: 'Utilisateurs',
  link: '/users'
},
{
  name: 'Test Erreur',
  link: '/doaskdlqmk'
}
]
const isOpen = ref(false)
</script>

<template>
  <nav class="w-full flex justify-between h-16 border-b border-gray-200 bg-transparent dark:border-gray-700">
    <div class="flex items-center px-4">
      <UButton
        class="flex md:hidden mr-4 text-center align-center"
        icon="material-symbols:menu"
        square
        variant="ghost"
        @click="isOpen = true"
      />
      <USlideover
        v-model="isOpen"
        side="left"
      >
        <UCard
          class="flex flex-col flex-1"
          :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
        >
          <template #header>
            <div class="flex items-center justify-between w-full">
              <div class="px-6 w-full h-16 flex flex-col">
                <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
                  <UButton variant="link">
                    <div class="relative inline-flex items-center justify-center flex-shrink-0 rounded-full h-5 w-5 text-[10px]">
                      <img
                        src="/icon.png"
                        alt="Logo"
                        class="rounded-full h-5 w-5 text-[10px]"
                      >
                    </div>
                    <span class="truncate text-gray-900 dark:text-white font-semibold">Libre & Vivant</span>
                  </UButton>
                </div>
              </div>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpen = false"
              />
            </div>
          </template>

          <div class="overflow-y-auto px-6 flex flex-col h-full">
            <div class="w-full gap-1.5 flex flex-col h-full justify-center">
              <div
                v-for="(link, index) in links"
                :key="index"
                class="flex mb-4"
              >
                <NuxtLink
                  v-slot="{ navigate }"
                  :to="link.link"
                  custom
                  class="flex w-full"
                >
                  <UButton
                    variant="ghost"
                    color="white"
                    class="px-2.5 py-1.5 w-full flex"
                    :class="route.path == link.link || (route.path.startsWith('/photobox') && link.link.startsWith('/photobox')) ? 'font-bold' : 'font-normal'"
                    size="xl"
                    @click="navigate"
                  >
                    <span
                      class="h-2 w-2 my-auto rounded-full mr-2"
                      :class="route.path == link.link || (route.path.startsWith('/photobox') && link.link.startsWith('/photobox')) ? 'bg-primary' : 'bg-transparent'"
                    />
                    <span class="text-2xl">
                      {{ link.name }}
                    </span>
                  </UButton>
                </NuxtLink>
              </div>
            </div>
          </div>
          <template #footer>
            <div class="mt-0 p-4">
              <UserDropdown />
            </div>
          </template>
        </UCard>
      </USlideover>
      <!-- Slot pour le breadcrumb -->
      <slot name="breadcrumb" />
    </div>

    <div class="flex items-center px-4">
      <slot name="action-button" />
    </div>
  </nav>
</template>
