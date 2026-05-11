<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { videos } from '../data/videos'

const route = useRoute()
const liked = ref(false)
const saved = ref(false)
const commentText = ref('')
const comments = ref([
  {
    id: 1,
    author: '小米',
    body: '这个布局很清爽，点赞、收藏和评论的位置也比较顺手。',
  },
  {
    id: 2,
    author: '阿杰',
    body: '后面可以继续加推荐算法和创作者数据看板。',
  },
])

const video = computed(() => {
  return videos.find((item) => item.id === route.params.videoId) ?? videos[0]
})

const relatedVideos = computed(() => {
  return videos.filter((item) => item.id !== video.value.id).slice(0, 5)
})

const likeCount = computed(() => video.value.likes + (liked.value ? 1 : 0))

watch(
  () => route.params.videoId,
  () => {
    liked.value = false
    saved.value = false
    commentText.value = ''
  },
)

function addComment() {
  const body = commentText.value.trim()

  if (!body) return

  comments.value.unshift({
    id: Date.now(),
    author: '我',
    body,
  })
  commentText.value = ''
}
</script>

<template>
  <section class="watch-view">
    <div class="watch-main">
      <div class="player-surface" :style="{ background: video.thumbnail }">
        <button type="button" aria-label="播放视频">播放</button>
      </div>

      <div class="watch-details">
        <div>
          <h1>{{ video.title }}</h1>
          <p>{{ video.views }} 次观看 · {{ video.postedAt }}</p>
        </div>
        <div class="video-actions">
          <button type="button" :class="{ active: liked }" @click="liked = !liked">
            点赞 {{ likeCount }}
          </button>
          <button type="button" :class="{ active: saved }" @click="saved = !saved">
            {{ saved ? '已收藏' : '收藏' }}
          </button>
          <RouterLink to="/upload">上传</RouterLink>
        </div>
      </div>

      <RouterLink class="creator-strip" :to="`/profile/${video.creatorId}`">
        <span class="creator-avatar">{{ video.avatar }}</span>
        <div>
          <strong>{{ video.creator }}</strong>
          <p>{{ video.description }}</p>
        </div>
      </RouterLink>

      <section class="comment-panel" aria-label="评论区">
        <h2>{{ comments.length }} 条评论</h2>
        <form class="comment-form" @submit.prevent="addComment">
          <input v-model="commentText" placeholder="写下你的评论" />
          <button type="submit" :disabled="!commentText.trim()">评论</button>
        </form>

        <article v-for="comment in comments" :key="comment.id" class="comment-item">
          <span class="creator-avatar small">{{ comment.author.slice(0, 2).toUpperCase() }}</span>
          <div>
            <strong>{{ comment.author }}</strong>
            <p>{{ comment.body }}</p>
          </div>
        </article>
      </section>
    </div>

    <aside class="related-list" aria-label="相关视频">
      <h2>接着看</h2>
      <RouterLink
        v-for="related in relatedVideos"
        :key="related.id"
        class="related-card"
        :to="`/watch/${related.id}`"
      >
        <div class="related-thumb" :style="{ background: related.thumbnail }">
          <span>{{ related.duration }}</span>
        </div>
        <div>
          <strong>{{ related.title }}</strong>
          <p>{{ related.creator }}</p>
          <span>{{ related.views }} 次观看</span>
        </div>
      </RouterLink>
    </aside>
  </section>
</template>
