<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'

type BasicInfoDto = {
  userId: number | null
  sex: number | null
  birthYear: number | null
  country: string
  province: string
  city: string
}

const form = ref<BasicInfoDto>({
  userId: 1,
  sex: 0,
  birthYear: 2000,
  country: '中国',
  province: '',
  city: '',
})

const loading = ref(false)
const message = ref('')
const error = ref('')

// 对应后端 BasicInfoDto，后端返回类型是 String。
// 如果你的真实接口路径不同，只需要修改这一行。
const basicInfoUrl = 'http://localhost:18281/auth/basic/info'

const canSubmit = computed(() => {
  return (
    form.value.userId !== null &&
    form.value.sex !== null &&
    form.value.birthYear !== null &&
    form.value.country.trim().length > 0 &&
    form.value.province.trim().length > 0 &&
    form.value.city.trim().length > 0
  )
})

async function submitBasicInfo() {
  if (!canSubmit.value || loading.value) return

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    // 请求体字段与后端 BasicInfoDto 完全一致：
    // userId、sex、birthYear、country、province、city。
    const response = await axios.post<string>(basicInfoUrl, form.value, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text',
    })

    message.value = response.data || '资料保存成功'
  } catch (requestError) {
    if (axios.isAxiosError<string>(requestError)) {
      error.value = requestError.response?.data || requestError.message || '资料保存失败，请稍后再试'
      return
    }

    error.value = '网络异常，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="basic-info-view">
    <div class="page-heading">
      <div>
        <p>账号资料</p>
        <h1>完善基础信息</h1>
      </div>
    </div>

    <div class="upload-layout">
      <form class="upload-form" @submit.prevent="submitBasicInfo">
        <div class="form-grid">
          <label>
            <span>用户 ID</span>
            <input v-model.number="form.userId" type="number" min="1" />
          </label>

          <label>
            <span>性别</span>
            <select v-model.number="form.sex">
              <option :value="0">未知</option>
              <option :value="1">男</option>
              <option :value="2">女</option>
            </select>
          </label>
        </div>

        <label>
          <span>出生年份</span>
          <input v-model.number="form.birthYear" type="number" min="1900" max="2026" />
        </label>

        <div class="form-grid">
          <label>
            <span>国家</span>
            <input v-model="form.country" placeholder="中国" />
          </label>

          <label>
            <span>省份</span>
            <input v-model="form.province" placeholder="广东省" />
          </label>
        </div>

        <label>
          <span>城市</span>
          <input v-model="form.city" placeholder="深圳市" />
        </label>

        <p v-if="message" class="notice success">{{ message }}</p>
        <p v-if="error" class="notice error">{{ error }}</p>

        <button class="primary-action" type="submit" :disabled="!canSubmit || loading">
          {{ loading ? '保存中...' : '保存资料' }}
        </button>
      </form>

      <aside class="upload-preview">
        <div class="preview-cover basic-preview">
          <span>资料</span>
        </div>
        <h2>BasicInfoDto</h2>
        <p>提交字段：userId、sex、birthYear、country、province、city。</p>
        <div class="tag-row">
          <span>ID {{ form.userId }}</span>
          <span>{{ form.birthYear }} 年</span>
          <span>{{ form.country }}</span>
          <span>{{ form.province || '省份' }}</span>
          <span>{{ form.city || '城市' }}</span>
        </div>
      </aside>
    </div>
  </section>
</template>
