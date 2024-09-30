<script setup>
const { loggedIn } = useUserSession()

if (!loggedIn.value) {
  navigateTo('/login')
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
  <div
    class="w-screen h-screen overflow-hidden"
  >
    <SideBar />
    <div class="md:ml-[18rem] h-screen overflow-y-scroll overflow-x-hidden">
      <NuxtPage />
      <UNotifications />
    </div>
  </div>
</template>
