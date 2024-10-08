<script setup lang="ts">
const toggleSidebar = () => {
  // Logique pour ouvrir/fermer le drawer
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <Navbar @toggle-sidebar="toggleSidebar">
      <template #breadcrumb>
        <UBreadcrumb
          divider="/"
          :links="[{ label: 'Statistiques' }]"
          class="my-auto"
        />
      </template>

      <template #action-button>
        <UButton
          icon="ic:baseline-plus"
          variant="solid"
          color="primary"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
        />
      </template>
    </Navbar>
    <div class="w-full h-full flex items-center justify-center" />
  </div>
</template>
