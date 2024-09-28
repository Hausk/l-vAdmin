<script setup>
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['toggle-sidebar'])

const isSidebarOpen = ref(true)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <nav class="w-full flex justify-between h-16 bg-red-300">
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
  </nav>
</template>
