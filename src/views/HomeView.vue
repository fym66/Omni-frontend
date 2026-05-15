<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { categories, videos } from '../data/videos'

type VideoInteraction = {
  liked: boolean
  saved: boolean
  commentOpen: boolean
  commentDraft: string
  comments: string[]
}

const route = useRoute()
const activeCategory = ref('全部')

const interactions = reactive<Record<string, VideoInteraction>>(
  Object.fromEntries(
    videos.map((video) => [
      video.id,
      {
        liked: false,
        saved: false,
        commentOpen: false,
        commentDraft: '',
        comments: ['这个视频节奏很舒服。', '封面和标题都挺吸引人。'],
      },
    ]),
  ),
)

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

function getInteraction(videoId: string) {
  return interactions[videoId]
}

function toggleLike(videoId: string) {
  const interaction = getInteraction(videoId)
  interaction.liked = !interaction.liked
}

function toggleSave(videoId: string) {
  const interaction = getInteraction(videoId)
  interaction.saved = !interaction.saved
}

function toggleComments(videoId: string) {
  const interaction = getInteraction(videoId)
  interaction.commentOpen = !interaction.commentOpen
}

function addComment(videoId: string) {
  const interaction = getInteraction(videoId)
  const comment = interaction.commentDraft.trim()

  if (!comment) return

  interaction.comments.unshift(comment)
  interaction.commentDraft = ''
}

function formatCount(count: number) {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }

  return String(count)
}
</script>

<template>
  <section class="douyin-home">
    <div class="douyin-tabs" aria-label="视频分类">
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

    <div class="short-feed" aria-label="推荐视频流">
      <article v-for="video in filteredVideos" :key="video.id" class="short-card">
        <div class="short-player" :style="{ background: video.thumbnail }">
          <button class="play-pill" type="button">播放</button>
          <span class="duration-pill">{{ video.duration }}</span>

          <div class="short-info">
            <RouterLink class="creator-line" :to="`/profile/${video.creatorId}`">
              <span class="creator-avatar">{{ video.avatar }}</span>
              <strong>{{ video.creator }}</strong>
            </RouterLink>
            <h1>{{ video.title }}</h1>
            <p>{{ video.description }}</p>
            <div class="video-tags">
              <span>#{{ video.category }}</span>
              <span>{{ video.views }} 次观看</span>
              <span>{{ video.postedAt }}</span>
            </div>
          </div>
        </div>

        <aside class="short-actions" aria-label="视频互动">
          <button
            type="button"
            :class="{ active: getInteraction(video.id).liked }"
            @click="toggleLike(video.id)"
          >
            <span>赞</span>
            {{ formatCount(video.likes + (getInteraction(video.id).liked ? 1 : 0)) }}
          </button>

          <button
            type="button"
            :class="{ active: getInteraction(video.id).commentOpen }"
            @click="toggleComments(video.id)"
          >
            <span>评</span>
            {{ video.comments + getInteraction(video.id).comments.length }}
          </button>

          <button
            type="button"
            :class="{ active: getInteraction(video.id).saved }"
            @click="toggleSave(video.id)"
          >
            <span>藏</span>
            {{ getInteraction(video.id).saved ? '已收藏' : '收藏' }}
          </button>

          <RouterLink :to="`/watch/${video.id}`">
            <span>看</span>
            详情
          </RouterLink>
        </aside>

        <section v-if="getInteraction(video.id).commentOpen" class="short-comments">
          <div class="short-comments-head">
            <h2>评论</h2>
            <button type="button" @click="toggleComments(video.id)">收起</button>
          </div>

          <form class="short-comment-form" @submit.prevent="addComment(video.id)">
            <input v-model="getInteraction(video.id).commentDraft" placeholder="留下你的想法" />
            <button type="submit" :disabled="!getInteraction(video.id).commentDraft.trim()">发送</button>
          </form>

          <div class="short-comment-list">
            <article v-for="comment in getInteraction(video.id).comments" :key="comment">
              <span class="creator-avatar small">我</span>
              <p>{{ comment }}</p>
            </article>
          </div>
        </section>
      </article>
    </div>
  </section>
</template>
