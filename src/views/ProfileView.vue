<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { videos } from '../data/videos'

const route = useRoute()
const following = ref(false)

const userId = computed(() => String(route.params.userId ?? 'me'))
const isMe = computed(() => userId.value === 'me')
const userVideos = computed(() => {
  if (isMe.value) return videos.slice(0, 4)

  const creatorVideos = videos.filter((video) => video.creatorId === userId.value)
  return creatorVideos.length > 0 ? creatorVideos : videos.slice(0, 3)
})

const profile = computed(() => {
  const firstVideo = userVideos.value[0]

  if (isMe.value) {
    return {
      name: '我的频道',
      handle: '@me',
      avatar: '我',
      bio: '在这里管理你的公开视频、点赞内容和基础资料。',
    }
  }

  return {
    name: firstVideo.creator,
    handle: `@${firstVideo.creatorId}`,
    avatar: firstVideo.avatar,
    bio: firstVideo.description,
  }
})
</script>

<template>
  <section class="profile-view">
    <div class="profile-hero">
      <span class="profile-avatar">{{ profile.avatar }}</span>
      <div>
        <p>{{ profile.handle }}</p>
        <h1>{{ profile.name }}</h1>
        <span>{{ profile.bio }}</span>
      </div>
      <button v-if="!isMe" type="button" :class="{ active: following }" @click="following = !following">
        {{ following ? '已关注' : '关注' }}
      </button>
      <div v-else class="profile-actions">
        <RouterLink class="soft-button" to="/upload">上传视频</RouterLink>
        <RouterLink class="soft-button muted" to="/basic-info">完善资料</RouterLink>
      </div>
    </div>

    <div class="stats-row">
      <article>
        <strong>{{ userVideos.length }}</strong>
        <span>视频</span>
      </article>
      <article>
        <strong>12.8 万</strong>
        <span>粉丝</span>
      </article>
      <article>
        <strong>240 万</strong>
        <span>总播放</span>
      </article>
    </div>

    <div class="section-title">
      <h2>最新视频</h2>
    </div>

    <div class="video-grid compact">
      <RouterLink
        v-for="video in userVideos"
        :key="video.id"
        class="video-card"
        :to="`/watch/${video.id}`"
      >
        <div class="thumbnail" :style="{ background: video.thumbnail }">
          <span>{{ video.duration }}</span>
        </div>
        <div class="video-meta no-avatar">
          <div>
            <h2>{{ video.title }}</h2>
            <p>{{ video.views }} 次观看 · {{ video.postedAt }}</p>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
