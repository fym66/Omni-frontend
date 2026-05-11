<script setup lang="ts">
import { computed, ref } from 'vue'

const title = ref('')
const description = ref('')
const category = ref('设计')
const tags = ref('')
const visibility = ref('公开')
const coverColor = ref('#2563eb')
const published = ref(false)

const canPublish = computed(() => {
  return title.value.trim().length > 0 && description.value.trim().length > 0
})

const tagList = computed(() => {
  return tags.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
})

function publishVideo() {
  if (!canPublish.value) return

  published.value = true
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

    <div class="upload-layout">
      <form class="upload-form" @submit.prevent="publishVideo">
        <label>
          <span>视频标题</span>
          <input v-model="title" placeholder="给视频起一个清楚的标题" />
        </label>

        <label>
          <span>视频简介</span>
          <textarea v-model="description" rows="6" placeholder="介绍这个视频的内容" />
        </label>

        <div class="form-grid">
          <label>
            <span>分类</span>
            <select v-model="category">
              <option>设计</option>
              <option>编程</option>
              <option>产品</option>
              <option>创作者</option>
              <option>界面</option>
            </select>
          </label>

          <label>
            <span>可见范围</span>
            <select v-model="visibility">
              <option>公开</option>
              <option>不公开列出</option>
              <option>私密</option>
            </select>
          </label>
        </div>

        <label>
          <span>标签</span>
          <input v-model="tags" placeholder="设计, AI, 推荐系统" />
        </label>

        <label>
          <span>封面主色</span>
          <input v-model="coverColor" type="color" />
        </label>

        <button class="primary-action" type="submit" :disabled="!canPublish">发布视频</button>
      </form>

      <aside class="upload-preview">
        <div
          class="preview-cover"
          :style="{
            background: `linear-gradient(135deg, #111827 0%, ${coverColor} 52%, #f8fafc 100%)`,
          }"
        >
          <span>预览</span>
        </div>
        <h2>{{ title || '视频标题预览' }}</h2>
        <p>{{ description || '视频简介会在发布前显示在这里。' }}</p>
        <div class="tag-row">
          <span>{{ category }}</span>
          <span>{{ visibility }}</span>
          <span v-for="tag in tagList" :key="tag">#{{ tag }}</span>
        </div>
        <strong v-if="published">视频已在本地发布。</strong>
      </aside>
    </div>
  </section>
</template>
