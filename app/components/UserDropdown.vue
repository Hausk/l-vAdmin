<script setup lang="ts">
const { user, clear } = useUserSession()

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

const items = computed(() => [
  [{
    slot: 'account',
    label: '',
    disabled: true
  }], [{
    label: 'Mode Nuit',
    icon: 'i-heroicons-command-line',
    click: toggleColorMode,
    check: colorMode.preference === 'dark'
  }],
  [{
    label: 'Se déconnecter',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: clear
  }]
])
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        block
        color="gray"
        variant="ghost"
        :label="user?.given_name"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar
            :src="user?.picture"
            size="2xs"
          />
        </template>

        <template #trailing>
          <UIcon
            name="i-heroicons-ellipsis-vertical"
            class="w-5 h-5 ml-auto"
          />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p>
          Connecté en tant que
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ user?.email }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <div class="w-full flex justify-between">
        <div class="flex w-full">
          <UIcon
            :name="item.icon"
            class="w-5 h-5 mr-2"
          />
          <span class="my-auto">{{ item.label }}</span>
        </div>
        <!-- Affiche une coche à droite si le mode est sombre -->
        <UIcon
          v-if="item.check"
          name="i-heroicons-check"
          class="w-5 h-5 text-green-500 ml-2"
        />
      </div>
    </template>
  </UDropdown>
</template>
