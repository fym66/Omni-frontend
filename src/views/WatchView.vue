<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { videos } from '../data/videos'

const route = useRoute()
const liked = ref(false)
const saved = ref(false)
const commentText = ref('')
const commentsOpen = ref(false)
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
    commentsOpen.value = false
  },
)

function toggleComments() {
  commentsOpen.value = !commentsOpen.value
}

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
  <section class="watch-view" :class="{ 'comments-active': commentsOpen }">
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
          <button type="button" :class="{ active: commentsOpen }" @click="toggleComments">
            评论 {{ comments.length }}
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

      <section class="comment-section" aria-label="评论区">
        <div class="comment-header">
          <h2>{{ comments.length }} 条评论</h2>
          <button v-if="!commentsOpen" type="button" class="comment-toggle-btn" @click="toggleComments">
            展开评论
          </button>
        </div>
        <div v-if="commentsOpen" class="comment-body">
          <form class="comment-form" @submit.prevent="addComment">
            <input v-model="commentText" placeholder="写下你的评论" />
            <button type="submit" :disabled="!commentText.trim()">评论</button>
          </form>

          <div class="comment-list">
            <article v-for="comment in comments" :key="comment.id" class="comment-item">
              <span class="creator-avatar small">{{ comment.author.slice(0, 2).toUpperCase() }}</span>
              <div>
                <strong>{{ comment.author }}</strong>
                <p>{{ comment.body }}</p>
              </div>
            </article>
          </div>
        </div>
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

<style scoped>
.comment-section {
  margin-top: 1.5rem;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-header h2 {
  font-size: 1rem;
  font-weight: 600;
}

.comment-toggle-btn {
  background: none;
  border: 1px solid #475569;
  color: #94a3b8;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.comment-toggle-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.comment-body {
  max-height: 300px;
  overflow-y: auto;
}

.comment-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.comment-form input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 0.85rem;
}

.comment-form input::placeholder {
  color: #64748b;
}

.comment-form button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
}

.comment-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.comment-item .creator-avatar {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  background: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
}

.comment-item strong {
  font-size: 0.8rem;
  color: #94a3b8;
}

.comment-item p {
  font-size: 0.85rem;
  color: #e2e8f0;
  margin-top: 0.15rem;
}

.video-actions .active {
  color: #3b82f6;
  border-color: #3b82f6;
}
</style>