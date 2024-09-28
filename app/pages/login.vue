<script setup lang="ts">
import type { NuxtError } from '#app'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'

const state = reactive({
  email: undefined,
  password: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)
}

async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
definePageMeta({
  layout: 'login'
})
</script>

<template>
  <div class="w-screen h-screen flex">
    <UContainer class="m-auto">
      <UCard>
        <div class="flex flex-col mb-8">
          <h1 class="text-2xl text-gray-900 dark:text-white font-bold">
            Se connecter
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            Connectes-toi pour accéder au dashboard de Libre & Vivant
          </p>
        </div>
        <div class="gap-y-6 flex flex-col">
          <UButton
            to="/api/auth/google"
            icon="i-simple-icons-google"
            label="Se connecter avec Google"
            color="gray"
            external
            size="xl"
            block
            variant="solid"
          />
          <UDivider label="OU" />
          <UForm
            :validate="validate"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormGroup
              label="Email"
              name="email"
            >
              <UInput v-model="state.email" />
            </UFormGroup>

            <UFormGroup
              label="Password"
              name="password"
            >
              <UInput
                v-model="state.password"
                class="mb-8"
                type="password"
              />
            </UFormGroup>

            <UButton
              type="submit"
              block
              class="mt-4"
              size="xl"
            >
              Confirmer
            </UButton>
          </UForm>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
