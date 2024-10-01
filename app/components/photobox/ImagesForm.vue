<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const images: Ref<any[]> = ref([])
const emit = defineEmits(['close'])

const state = reactive({
  name: undefined,
  email: undefined,
  file: undefined
})

const handleFiles = (event: any) => {
  const files: any[] = Array.from(event)
  files.forEach((file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e: ProgressEvent<FileReader>) => {
      images.value.push({ name: file.name, url: e.target?.result })
    }
  })
}
// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event)

  emit('close')
}
</script>

<template>
  <div class="p-5">
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="state"
      class="space-y-4 mb-5"
      @submit="onSubmit"
    >
      <UFormGroup
        label="file"
        name="file"
      >
        <UInput
          v-model="state.file"
          type="file"
          size="sm"
          icon="i-heroicons-folder"
          accept=".jpg, .jpeg, .png, .gif"
          multiple="true"
          @change="handleFiles"
        />
      </UFormGroup>

      <div class="flex justify-end gap-3">
        <UButton
          label="Cancel"
          color="gray"
          variant="ghost"
          @click="emit('close')"
        />
        <UButton
          type="submit"
          label="Save"
          color="black"
        />
      </div>
    </UForm>
    <div class="w-full columns-3">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="mb-4"
      >
        <img
          :src="image.url"
          alt="test"
          class="w-full aspect-square"
        >
      </div>
    </div>
  </div>
</template>
