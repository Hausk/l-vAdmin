<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold leading-6">
        Todo List
      </h3>
      <UButton
        v-if="!loggedIn"
        to="/api/auth/google"
        icon="i-simple-icons-google"
        label="Se connecter avec Google"
        color="white"
        external
      />
      <UButton
        v-else
        to="/todos"
        icon="i-heroicons-list-bullet"
        label="Go to Todos"
        color="black"
      />
    </template>
    <p class="font-medium">
      Bonjour.
    </p>
    <p>
      Page d'initialisation du repo avec Authentification google pour le moment.
    </p>
    <hr class="dark:border-gray-700">
    <p class="text-sm text-gray-700 dark:text-gray-300 italic">
      Aucune informations de votre compte Google est stocké en base de données.<br>
      Pour le moment je stock uniquement la liste des tâches créé et reliées par votre id GOOGLE.
    </p>
  </UCard>
</template>
