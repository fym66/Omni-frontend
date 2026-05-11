<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { categories, videos } from '../data/videos'

const route = useRoute()
const activeCategory = ref('全部')

const filteredVideos = computed(() => {
  const searchText = String(route.query.q ?? '').toLowerCase()

  return videos.filter((video) => {
    const matchesCategory = activeCategory.value === '全部' || video.category === activeCategory.value
    const matchesSearch =
      !searchText ||
      video.title.toLowerCase().includes(searchText) ||
      video.creator.toLowerCase().includes(searchText) ||
      video.category.toLowerCase().includes(searchText)

    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <section class="home-view">
    <div class="page-heading">
      <div>
        <p>为你推荐</p>
        <h1>发现下一个想看的视频</h1>
      </div>
      <RouterLink class="soft-button" to="/upload">上传视频</RouterLink>
    </div>

    <div class="category-row" aria-label="视频分类">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :class="{ active: activeCategory === category }"
        @click="activeCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="video-grid">
      <RouterLink
        v-for="video in filteredVideos"
        :key="video.id"
        class="video-card"
        :to="`/watch/${video.id}`"
      >
        <div class="thumbnail" :style="{ background: video.thumbnail }">
          <span>{{ video.duration }}</span>
        </div>
        <div class="video-meta">
          <span class="creator-avatar">{{ video.avatar }}</span>
          <div>
            <h2>{{ video.title }}</h2>
            <p>{{ video.creator }}</p>
            <span>{{ video.views }} 次观看 · {{ video.postedAt }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
