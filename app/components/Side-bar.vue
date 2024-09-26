<script setup>
const account = {
  userName: 'Jonathan Bessa',
  email: 'test@test.fr',
  role: 'admin'
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
</script>

<template>
  <div class="w-[18rem] justify-between h-screen fixed left-0 top-0 sidebar hidden md:flex flex-col lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
    <div class="px-6 w-full h-16 flex items-center">
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
    <div class="overflow-y-auto mt-4 px-6 flex flex-col h-full">
      <ul class="w-full gap-1.5 flex flex-col">
        <li
          v-for="(link, index) in links"
          :key="index"
          class="w-full"
        >
          <UButton
            :to="link.link"
            variant="ghost"
            color="gray"
            class="px-2.5 py-1.5 w-full"
          >
            {{ link.name }}
          </UButton>
        </li>
      </ul>
    </div>
    <!-- Footer de la Sidebar -->
    <div class="mt-0 p-4">
      <hr>
      <a class="flex items-center gap-2 cursor-pointer">
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          shape="circle"
        />
        <div>
          <span class="font-bold">{{ account.userName }}</span>
          <span class="text-xs">{{ account.role }}</span>
        </div>
      </a>
    </div>
  </div>
</template>
