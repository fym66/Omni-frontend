<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { clearAuthToken } from '../utils/auth'

const router = useRouter()
const query = ref('')

const navItems = [
  { label: '首页', icon: '首', to: '/' },
  { label: '上传', icon: '传', to: '/upload' },
  { label: '资料', icon: '资', to: '/basic-info' },
  { label: '我的', icon: '我', to: '/profile/me' },
]

const searchable = computed(() => query.value.trim().length > 0)

function submitSearch() {
  if (!searchable.value) return

  router.push({
    path: '/',
    query: {
      q: query.value.trim(),
    },
  })
}

function logout() {
  clearAuthToken()
  router.push('/login')
}
</script>

<template>
  <div class="app-frame">
    <header class="topbar">
      <RouterLink class="app-logo" to="/" aria-label="Omni 首页">
        <span>O</span>
        <strong>Omni</strong>
      </RouterLink>

      <form class="search-box" @submit.prevent="submitSearch">
        <input v-model="query" type="search" placeholder="搜索视频、创作者或话题" />
        <button type="submit" :disabled="!searchable">搜索</button>
      </form>

      <nav class="top-actions" aria-label="主要导航">
        <RouterLink class="upload-link" to="/upload">上传</RouterLink>
        <RouterLink class="avatar-link" to="/profile/me" aria-label="打开个人主页">我</RouterLink>
        <button class="logout-button" type="button" @click="logout">退出</button>
      </nav>
    </header>

    <aside class="sidebar" aria-label="主导航">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
        <span>{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </aside>

    <main class="content-area">
      <RouterView />
    </main>
  </div>
</template>
