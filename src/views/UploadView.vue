<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveLocalVideo, formatFileSize } from '../utils/videoStorage'

const router = useRouter()

const title = ref('')
const published = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

const videoFile = ref<File | null>(null)
const videoPreviewUrl = ref('')

const canPublish = computed(() => {
  return title.value.trim().length > 0 && videoFile.value !== null
})

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  if (!validTypes.includes(file.type)) {
    alert('请选择有效的视频文件（MP4, WebM, OGG, MOV）')
    input.value = ''
    return
  }

  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    alert(`文件过大！最大支持 100MB，当前文件 ${formatFileSize(file.size)}`)
    input.value = ''
    return
  }

  videoFile.value = file
  videoPreviewUrl.value = URL.createObjectURL(file)
}

async function publishVideo() {
  if (!canPublish.value || !videoFile.value) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    const progressInterval = setInterval(() => {
      uploadProgress.value = Math.min(uploadProgress.value + Math.random() * 15, 90)
    }, 200)

    const dataUrl = await fileToDataUrl(videoFile.value)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    const newVideo = {
      id: 'local_' + Date.now(),
      title: title.value.trim(),
      dataUrl,
      createdAt: new Date().toISOString(),
      fileName: videoFile.value.name,
      fileSize: videoFile.value.size,
      fileType: videoFile.value.type,
    }

    saveLocalVideo(newVideo)
    published.value = true

    setTimeout(() => {
      router.push(`/watch/${newVideo.id}`)
    }, 1500)
  } catch (err) {
    alert('上传失败，请重试')
    console.error(err)
  } finally {
    uploading.value = false
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function removeVideo() {
  if (videoPreviewUrl.value) {
    URL.revokeObjectURL(videoPreviewUrl.value)
  }
  videoFile.value = null
  videoPreviewUrl.value = ''
}
</script>

<template>
  <section class="upload-view">
    <div class="page-heading">
      <div>
        <p>创作者工具</p>
        <h1>上传新视频</h1>
      </div>
    </div>

    <div v-if="published" class="upload-success">
      <h2>🎉 视频已成功上传到本地存储！</h2>
      <p>正在跳转到视频播放页...</p>
    </div>

    <div v-else class="upload-layout">
      <form class="upload-form" @submit.prevent="publishVideo">
        <div class="file-upload-area">
          <label v-if="!videoFile" class="file-upload-label">
            <input
              type="file"
              accept="video/*"
              @change="handleFileSelect"
              class="file-input-hidden"
            />
            <div class="file-upload-placeholder">
              <span class="upload-icon">📹</span>
              <span>点击选择本地视频文件</span>
              <span class="upload-hint">支持 MP4, WebM, OGG, MOV 格式，最大 100MB</span>
            </div>
          </label>

          <div v-else class="file-selected">
            <video
              :src="videoPreviewUrl"
              class="video-preview"
              controls
              preload="metadata"
            ></video>
            <div class="file-info">
              <span class="file-name">{{ videoFile.name }}</span>
              <span class="file-size">{{ formatFileSize(videoFile.size) }}</span>
              <button type="button" class="remove-video-btn" @click="removeVideo">移除</button>
            </div>
          </div>
        </div>

        <label>
          <span>视频标题</span>
          <input v-model="title" placeholder="给视频起一个清楚的标题" />
        </label>

        <div v-if="uploading" class="upload-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <span>{{ Math.round(uploadProgress) }}%</span>
        </div>

        <button
          class="primary-action"
          type="submit"
          :disabled="!canPublish || uploading"
        >
          {{ uploading ? '上传中...' : '上传视频' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.file-upload-area {
  margin-bottom: 1.5rem;
}

.file-upload-label {
  display: block;
  cursor: pointer;
}

.file-input-hidden {
  display: none;
}

.file-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 1.5rem;
  border: 2px dashed #334155;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.2s;
}

.file-upload-placeholder:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.upload-icon {
  font-size: 2.5rem;
}

.upload-hint {
  font-size: 0.8rem;
  color: #6b7280;
}

.file-selected {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.video-preview {
  width: 100%;
  max-height: 250px;
  border-radius: 8px;
  background: #000;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #1e293b;
  border-radius: 8px;
  font-size: 0.85rem;
}

.file-name {
  flex: 1;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #94a3b8;
}

.remove-video-btn {
  background: none;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.remove-video-btn:hover {
  background: #ef4444;
  color: white;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #1e293b;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.upload-success {
  text-align: center;
  padding: 4rem 2rem;
}

.upload-success h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.upload-success p {
  color: #94a3b8;
}
</style>