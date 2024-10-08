<!-- Navbar.vue -->
<script setup>
import { defineEmits, ref } from 'vue'

const route = useRoute()

const emit = defineEmits(['toggle-sidebar'])

const isSidebarOpen = ref(true)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  emit('toggle-sidebar')
}
const isActive = (link) => {
  if (link === '/photobox') {
    return route.path.startsWith('/photobox')
  }
  return route.path === link
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
  <nav class="w-full flex justify-between h-16 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center px-4">
      <Button
        class="mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 hidden md:block"
        text
        @click="toggleSidebar"
      >
        <Icon
          name="material-symbols:menu"
          size="24px"
          class="duration-300 m-auto"
        />
      </Button>

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

          <div class="overflow-y-auto mt-4 px-6 flex flex-col h-full">
            <ul class="w-full gap-1.5 flex flex-col">
              <li
                v-for="(link, index) in links"
                :key="index"
                class="w-full flex"
              >
                <NuxtLink
                  v-slot="{ navigate }"
                  :to="link.link"
                  custom
                  class="flex w-full"
                >
                  <UButton
                    variant="ghost"
                    :color="route.path == link.link ? 'primary' : 'white'"
                    class="px-2.5 py-1.5 w-full"
                    :class="route.path == link.link ? 'font-bold' : 'font-normal'"
                    :label="link.name"
                    size="xl"
                    @click="navigate"
                  />
                </NuxtLink>
              </li>
            </ul>
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
      <!-- Slot pour le bouton d'action -->
      <slot name="action-button" />
    </div>
  </nav>
</template>
