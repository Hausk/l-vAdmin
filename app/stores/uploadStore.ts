import { defineStore } from 'pinia'

export const useUploadStore = defineStore('upload', {
  state: () => ({
    isUploading: false,
    uploadProgress: 0,
    totalImages: 0,
    uploadedImages: 0
  }),
  actions: {
    startUpload(totalImages: number) {
      this.isUploading = true
      this.uploadProgress = 0
      this.totalImages = totalImages
      this.uploadedImages = 0
    },
    updateProgress(uploadedImages: number) {
      this.uploadedImages = uploadedImages
      this.uploadProgress = (uploadedImages / this.totalImages) * 100
    },
    finishUpload() {
      this.isUploading = false
      this.uploadProgress = 100
    }
  }
})
