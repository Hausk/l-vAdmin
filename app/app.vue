<script setup>
const { loggedIn } = useUserSession()
const colorMode = useColorMode()

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/icon.png' }]
})

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Dashboard - Libre & Vivant',
  description:
    'Partie Administration du même site vitrine.',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <SideBar />
  <div class="md:ml-[22rem]">
    <Navbar />
    <UContainer class="min-h-screen flex flex-col justify-center">
      <div class="mb-2 text-right">
        <UButton
          square
          variant="ghost"
          color="black"
          :icon="$colorMode.preference === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          @click="toggleColorMode"
        />
      </div>

      <NuxtPage />
    </UContainer>
    <UNotifications />
  </div>
</template>

<style lang="postcss">
body {
  @apply font-sans text-gray-950 bg-gray-50 dark:bg-gray-950 dark:text-gray-50;
}
</style>
