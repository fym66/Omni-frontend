<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'

type AuthMode = 'login' | 'register'
type AuthStep = 'code' | 'verify'

const mode = ref<AuthMode>('login')
const step = ref<AuthStep>('code')

// 后端请求体字段：String email
const email = ref('')

// 后端请求体字段：String code；发送验证码阶段为空字符串，校验阶段填写用户输入。
const code = ref('')

const loading = ref(false)
const message = ref('')
const error = ref('')

// 后端服务地址。最终请求地址会拼成：
// http://localhost:18281/auth/login/code
// http://localhost:18281/auth/login/verify
// http://localhost:18281/auth/register/code
// http://localhost:18281/auth/register/verify
const apiBase = 'http://localhost:18281'

const modeCopy = computed(() => {
  if (mode.value === 'login') {
    return {
      eyebrow: 'Welcome back',
      title: '登录 Omni',
      subtitle: '输入邮箱，我们会发送一次性验证码。',
      primary: step.value === 'code' ? '获取登录验证码' : '完成登录',
      switchText: '还没有账号？',
      switchAction: '创建账号',
    }
  }

  return {
    eyebrow: 'Create account',
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
    // Axios POST 请求体，字段名与后端 DTO 保持一致。
    const requestBody = {
      email: email.value.trim(),
      code: step.value === 'verify' ? code.value.trim() : '',
    }

    // 后端返回值是 String，所以这里用 responseType: 'text' 按纯文本接收。
    const response = await axios.post<string>(`${apiBase}${endpoint.value}`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text',
    })

    const responseText = response.data || '请求成功'

    if (step.value === 'code') {
      step.value = 'verify'
      message.value = responseText
      return
    }

    message.value = responseText
  } catch (requestError) {
    if (axios.isAxiosError<string>(requestError)) {
      error.value = requestError.response?.data || requestError.message || '请求失败，请稍后再试'
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
