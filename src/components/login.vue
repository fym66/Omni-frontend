<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setAuthToken } from '../utils/auth'

type AuthMode = 'login' | 'register'
type AuthStep = 'code' | 'verify'

type ApiResponse = {
  code: number
  msg: string
  data?: {
    token?: string
  }
}

const router = useRouter()
const route = useRoute()
const mode = ref<AuthMode>('login')
const step = ref<AuthStep>('code')

const email = ref('')
const code = ref('')

const loading = ref(false)
const message = ref('')
const error = ref('')

const apiBase = 'http://localhost:18281'

const modeCopy = computed(() => {
  if (mode.value === 'login') {
    return {
      eyebrow: '欢迎回来',
      title: '登录 Omni',
      subtitle: '输入邮箱，我们会发送一次性验证码。',
      primary: step.value === 'code' ? '获取登录验证码' : '完成登录',
      switchText: '还没有账号？',
      switchAction: '创建账号',
    }
  }

  return {
    eyebrow: '创建账号',
    title: '注册 Omni',
    subtitle: '使用邮箱验证码创建你的账号。',
    primary: step.value === 'code' ? '获取注册验证码' : '完成注册',
    switchText: '已经有账号？',
    switchAction: '去登录',
  }
})

const endpoint = computed(() => `/auth/${mode.value}/${step.value}`)
const canSubmit = computed(() => {
  return email.value.trim().length > 0 && (step.value === 'code' || code.value.trim().length > 0)
})

async function requestAuth() {
  if (!canSubmit.value || loading.value) return

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const requestBody = {
      email: email.value.trim(),
      code: step.value === 'verify' ? code.value.trim() : '',
    }

    const response = await axios.post<ApiResponse>(`${apiBase}${endpoint.value}`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const body = response.data
    const msg = body?.msg ?? '请求成功'
    const token = body?.data?.token

    if (step.value === 'code') {
      step.value = 'verify'
      message.value = msg
      return
    }

    message.value = msg

    if (mode.value === 'register') {
      mode.value = 'login'
      step.value = 'code'
      code.value = ''
      message.value = msg || '注册成功，请登录'
      return
    }

    if (!token) {
      error.value = msg || '登录失败，未获取到凭证'
      return
    }

    setAuthToken(token)
    router.push(String(route.query.redirect ?? '/'))
  } catch (requestError) {
    if (axios.isAxiosError<ApiResponse>(requestError)) {
      const errBody = requestError.response?.data
      error.value = errBody?.msg || requestError.message || '请求失败，请稍后再试'
      return
    }

    error.value = '网络异常，请稍后再试'
  } finally {
    loading.value = false
  }
}

function switchMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  step.value = 'code'
  code.value = ''
  message.value = ''
  error.value = ''
}

function editEmail() {
  step.value = 'code'
  code.value = ''
  message.value = ''
  error.value = ''
}
</script>

<template>
  <main class="auth-shell">
    <section class="product-panel" aria-label="Omni">
      <div class="brand-mark">O</div>
      <div class="product-copy">
        <h1>Omni</h1>
        <span>Think what you want to see</span>
      </div>
    </section>

    <section class="auth-panel" aria-label="登录注册表单">
      <div class="auth-card">
        <div class="auth-heading">
          <p>{{ modeCopy.eyebrow }}</p>
          <h2>{{ modeCopy.title }}</h2>
          <span>{{ modeCopy.subtitle }}</span>
        </div>

        <form class="auth-form" @submit.prevent="requestAuth">
          <label>
            <span>邮箱</span>
            <input
              v-model="email"
              autocomplete="email"
              inputmode="email"
              placeholder="you@example.com"
              :disabled="loading || step === 'verify'"
            />
          </label>

          <label v-if="step === 'verify'">
            <span>验证码</span>
            <input
              v-model="code"
              autocomplete="one-time-code"
              inputmode="numeric"
              maxlength="6"
              placeholder="6 位验证码"
              :disabled="loading"
            />
          </label>

          <p v-if="message" class="notice success">{{ message }}</p>
          <p v-if="error" class="notice error">{{ error }}</p>

          <button class="primary-action" type="submit" :disabled="!canSubmit || loading">
            {{ loading ? '处理中...' : modeCopy.primary }}
          </button>
        </form>

        <div class="auth-actions">
          <button v-if="step === 'verify'" type="button" @click="editEmail">修改邮箱</button>
          <button type="button" @click="switchMode">
            {{ modeCopy.switchText }}{{ modeCopy.switchAction }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>