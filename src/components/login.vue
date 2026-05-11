<script setup lang="ts">
import { computed, ref } from 'vue'

type AuthMode = 'login' | 'register'
type AuthStep = 'code' | 'verify'

const mode = ref<AuthMode>('login')
const step = ref<AuthStep>('code')
const account = ref('')
const code = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''

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
    subtitle: '用验证码创建你的账号，过程很短，也很安静。',
    primary: step.value === 'code' ? '获取注册验证码' : '完成注册',
    switchText: '已经有账号？',
    switchAction: '去登录',
  }
})

const endpoint = computed(() => `/auth/${mode.value}/${step.value}`)
const canSubmit = computed(() => {
  return account.value.trim().length > 0 && (step.value === 'code' || code.value.trim().length > 0)
})

async function requestAuth() {
  if (!canSubmit.value || loading.value) return

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const body =
      step.value === 'code'
        ? { account: account.value.trim() }
        : { account: account.value.trim(), code: code.value.trim() }

    const response = await fetch(`${apiBase}${endpoint.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await parseResponse(response)

    if (!response.ok) {
      throw new Error(result?.message || result?.error || '请求失败，请稍后再试')
    }

    if (step.value === 'code') {
      step.value = 'verify'
      message.value = '验证码已发送，请查看你的邮箱。'
      return
    }

    message.value = mode.value === 'login' ? '登录成功。' : '注册成功。'
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : '网络异常，请稍后再试'
  } finally {
    loading.value = false
  }
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

function switchMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  step.value = 'code'
  code.value = ''
  message.value = ''
  error.value = ''
}

function editAccount() {
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
              v-model="account"
              autocomplete="username"
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
          <button v-if="step === 'verify'" type="button" @click="editAccount">修改账号</button>
          <button type="button" @click="switchMode">
            {{ modeCopy.switchText }}{{ modeCopy.switchAction }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
