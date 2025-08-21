import { App } from './App.js'
import { registerSW } from 'virtual:pwa-register'
import './styles/main.css'

// 注册PWA Service Worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

// 检测系统语言
function detectSystemLanguage() {
  const systemLang = navigator.language || navigator.userLanguage
  return systemLang.startsWith('zh') ? 'zh' : 'en'
}

// 初始化应用
async function initApp() {
  // 检测系统语言并设置
  const systemLang = detectSystemLanguage()
  localStorage.setItem('language', systemLang)
  
  // 检测系统主题
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  localStorage.setItem('theme', prefersDark ? 'dark' : 'light')
  
  // 创建应用实例
  const app = new App()
  await app.init()
  
  // 隐藏加载屏幕
  const loadingScreen = document.getElementById('loadingScreen')
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out')
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 500)
  }
}

// 跳过按钮事件
document.getElementById('skipButton')?.addEventListener('click', () => {
  const loadingScreen = document.getElementById('loadingScreen')
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out')
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 500)
  }
  initApp()
})

// 自动启动应用（3秒后）
setTimeout(initApp, 3000)

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme') === 'auto') {
    localStorage.setItem('theme', e.matches ? 'dark' : 'light')
    // 触发主题更新事件
    window.dispatchEvent(new CustomEvent('themeChange'))
  }
})