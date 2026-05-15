export interface LocalVideo {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  visibility: '公开' | '不公开列出' | '私密'
  dataUrl: string
  createdAt: string
  fileName: string
  fileSize: number
  fileType: string
}

const STORAGE_KEY = 'omni_local_videos'

export function getLocalVideos(): LocalVideo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveLocalVideo(video: LocalVideo): void {
  const videos = getLocalVideos()
  videos.unshift(video)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

export function getLocalVideoById(id: string): LocalVideo | undefined {
  return getLocalVideos().find((v) => v.id === id)
}

export function deleteLocalVideo(id: string): void {
  const videos = getLocalVideos().filter((v) => v.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}