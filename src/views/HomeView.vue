<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { videos } from '../data/videos'

type CommentItem = {
  id: number
  author: string
  location: string
  time: string
  body: string
  likes: number
  avatar: string
}

type VideoInteraction = {
  liked: boolean
  saved: boolean
  shared: boolean
  commentsOpen: boolean
  commentDraft: string
  comments: CommentItem[]
}

const route = useRoute()
const currentIndex = ref(0)

const interactions = reactive<Record<string, VideoInteraction>>(
  Object.fromEntries(
    videos.map((video, index) => [
      video.id,
      {
        liked: false,
        saved: false,
        shared: false,
        commentsOpen: false,
        commentDraft: '',
        comments: [
          {
            id: index * 10 + 1,
            author: '大黑耗子',
            location: '江苏',
            time: '3 分钟前',
            body: '这个画面很有生活气，主页面这样直接看推荐就对了。',
            likes: 2,
            avatar: '黑',
          },
          {
            id: index * 10 + 2,
            author: '爱打游戏的瘦龙',
            location: '广东',
            time: '27 分钟前',
            body: '评论区右侧展开以后，视频不用离开当前页面，体验舒服很多。',
            likes: 4,
            avatar: '龙',
          },
          {
            id: index * 10 + 3,
            author: '了了',
            location: '河南',
            time: '16 分钟前',
            body: '首页直接推荐视频，不需要再点详情页，这个逻辑更像抖音网页版。',
            likes: 0,
            avatar: '了',
          },
        ],
      },
    ]),
  ),
)

const filteredVideos = computed(() => {
  const searchText = String(route.query.q ?? '').toLowerCase()

  if (!searchText) return videos

  return videos.filter((video) => {
    return (
      video.title.toLowerCase().includes(searchText) ||
      video.creator.toLowerCase().includes(searchText) ||
      video.category.toLowerCase().includes(searchText)
    )
  })
})

const currentVideo = computed(() => filteredVideos.value[currentIndex.value] ?? videos[0])
const currentInteraction = computed(() => interactions[currentVideo.value.id])
const totalComments = computed(() => currentVideo.value.comments + currentInteraction.value.comments.length)
const progress = computed(() => `${Math.min(94, 18 + currentIndex.value * 11)}%`)

function formatCount(count: number) {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`

  return String(count)
}

function setCurrentVideo(direction: 1 | -1) {
  const videoCount = filteredVideos.value.length
  if (videoCount <= 1) return

  currentIndex.value = (currentIndex.value + direction + videoCount) % videoCount
}

function toggleLike() {
  currentInteraction.value.liked = !currentInteraction.value.liked
}

function toggleSave() {
  currentInteraction.value.saved = !currentInteraction.value.saved
}

function toggleShare() {
  currentInteraction.value.shared = !currentInteraction.value.shared
}

function toggleComments() {
  currentInteraction.value.commentsOpen = !currentInteraction.value.commentsOpen
}

function addComment() {
  const body = currentInteraction.value.commentDraft.trim()

  if (!body) return

  currentInteraction.value.comments.unshift({
    id: Date.now(),
    author: '我',
    location: '本地',
    time: '刚刚',
    body,
    likes: 0,
    avatar: '我',
  })
  currentInteraction.value.commentDraft = ''
}
</script>

<template>
  <section class="douyin-page" :class="{ 'comments-mode': currentInteraction.commentsOpen }">
    <div class="douyin-video-shell">
      <div class="douyin-video" :style="{ background: currentVideo.thumbnail }">
        <div class="douyin-video-shade"></div>

        <button class="douyin-play" type="button" aria-label="播放当前视频">
          {{ currentInteraction.commentsOpen ? '▶' : '暂停' }}
        </button>

        <div class="douyin-watermark">
          <strong>网速</strong>
          <span>最快一次</span>
        </div>

        <div class="douyin-caption">
          <h1>{{ currentVideo.title }}</h1>
          <p>@{{ currentVideo.creator }} · {{ currentVideo.postedAt }}</p>
          <span>{{ currentVideo.description }}</span>
          <div class="douyin-tags">
            <strong>#{{ currentVideo.category }}</strong>
            <strong>#推荐</strong>
            <strong>#原始生活</strong>
          </div>
          <div class="douyin-collection">
            <button type="button">合集 · 文明重启</button>
            <button type="button">识别画面</button>
          </div>
        </div>

        <aside class="douyin-actions" aria-label="视频互动">
          <button class="creator-button" type="button">
            <span>{{ currentVideo.avatar }}</span>
          </button>
          <button type="button" :class="{ active: currentInteraction.liked }" @click="toggleLike">
            <span>♥</span>
            {{ formatCount(currentVideo.likes + (currentInteraction.liked ? 1 : 0)) }}
          </button>
          <button type="button" :class="{ active: currentInteraction.commentsOpen }" @click="toggleComments">
            <span>•••</span>
            {{ totalComments }}
          </button>
          <button type="button" :class="{ active: currentInteraction.saved }" @click="toggleSave">
            <span>★</span>
            {{ currentInteraction.saved ? '已收藏' : formatCount(159) }}
          </button>
          <button type="button" :class="{ active: currentInteraction.shared }" @click="toggleShare">
            <span>↗</span>
            {{ currentInteraction.shared ? '已分享' : '88' }}
          </button>
          <button type="button">
            <span>♫</span>
            听抖音
          </button>
        </aside>

        <div class="douyin-switcher">
          <button type="button" @click="setCurrentVideo(-1)">上一个</button>
          <button type="button" @click="setCurrentVideo(1)">下一个</button>
        </div>
      </div>

      <div class="douyin-controls">
        <button type="button">▶</button>
        <span>00:06 / {{ currentVideo.duration }}</span>
        <button type="button">弹</button>
        <button type="button">弹幕</button>
        <form class="bullet-form" @submit.prevent>
          <input placeholder="发一条友好的弹幕吧" />
          <button type="submit">发送</button>
        </form>
        <div class="control-right">
          <span>连播</span>
          <span>清屏</span>
          <span>智能</span>
          <span>倍速</span>
          <span>全屏</span>
        </div>
        <div class="progress-line">
          <i :style="{ width: progress }"></i>
        </div>
      </div>
    </div>

    <aside v-if="currentInteraction.commentsOpen" class="douyin-comment-panel" aria-label="评论区">
      <div class="comment-tabs">
        <button type="button">详情</button>
        <button type="button">TA的作品</button>
        <button class="active" type="button">评论</button>
        <button type="button">合集</button>
        <button type="button">问AI</button>
        <button type="button">相关推荐</button>
        <button type="button" @click="toggleComments">×</button>
      </div>

      <div class="comment-search">
        大家都在搜：<strong>{{ currentVideo.category }}</strong>
      </div>

      <h2>全部评论({{ totalComments }})</h2>

      <div class="comment-list">
        <article v-for="comment in currentInteraction.comments" :key="comment.id" class="douyin-comment">
          <span class="comment-avatar">{{ comment.avatar }}</span>
          <div>
            <strong>{{ comment.author }}</strong>
            <p>{{ comment.body }}</p>
            <small>{{ comment.time }} · {{ comment.location }}</small>
            <div class="comment-actions">
              <button type="button">回复</button>
              <button type="button">分享</button>
              <button type="button">♡ {{ comment.likes }}</button>
            </div>
          </div>
        </article>
      </div>

      <form class="comment-input-bar" @submit.prevent="addComment">
        <input v-model="currentInteraction.commentDraft" placeholder="留下你的精彩评论吧" />
        <button type="submit" :disabled="!currentInteraction.commentDraft.trim()">发送</button>
      </form>
    </aside>
  </section>
</template>
