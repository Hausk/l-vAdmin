<script setup>
import { defineEmits, ref, onMounted } from 'vue'

const emit = defineEmits(['toggle-sidebar'])

const toggleDarkMode = () => {
  const element = document.querySelector('html')
  element.classList.toggle('dark')

  // Enregistrer le mode sombre dans localStorage
  const isDarkMode = element.classList.contains('dark')
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false')
}

// Vérifier et appliquer le mode sombre lors du chargement de la page
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    document.querySelector('html').classList.add('dark')
  }
})

const isSidebarOpen = ref(true)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <nav class="w-full flex justify-between">
    <Button
      class="mr-4 hover:bg-red-400 hidden md:flex"
      text
      @click="emit('toggle-sidebar'), toggleSidebar()"
    >
      <Icon
        name="material-symbols:arrow-forward-rounded"
        size="24px"
        :class="isSidebarOpen ? 'rotate-180' : ''"
        class="duration-300 m-auto"
      />
    </Button>

    <NavbarMobileMenu />

    <Button
      label="Toggle Dark Mode"
      class="my-auto"
      @click="toggleDarkMode()"
    />
  </nav>
</template>
