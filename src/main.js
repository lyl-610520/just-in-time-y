import './styles/main.css'

// 注册PWA Service Worker（如果可用）
if ('serviceWorker' in navigator) {
  try {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({ immediate: true })
    })
  } catch (error) {
    console.log('PWA registration not available:', error)
  }
}

// 检测系统语言
function detectSystemLanguage() {
  const systemLang = navigator.language || navigator.userLanguage
  return systemLang.startsWith('zh') ? 'zh' : 'en'
}

// 隐藏加载屏幕
function hideLoadingScreen() {
  console.log('Hiding loading screen...')
  const loadingScreen = document.getElementById('loadingScreen')
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out')
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 500)
  }
}

// 创建简单的应用界面
function createSimpleApp() {
  console.log('Creating simple app interface...')
  
  // 创建主容器
  const appContainer = document.createElement('div')
  appContainer.id = 'appContainer'
  appContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 1;
  `
  
  // 创建标题
  const title = document.createElement('h1')
  title.textContent = 'Just In Time - 恰逢其时'
  title.style.cssText = `
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
  `
  
  // 创建副标题
  const subtitle = document.createElement('p')
  subtitle.textContent = '应用已成功启动！'
  subtitle.style.cssText = `
    font-size: 1.2rem;
    opacity: 0.8;
    text-align: center;
    margin-bottom: 2rem;
  `
  
  // 创建说明文字
  const description = document.createElement('p')
  description.textContent = '跳过按钮现在应该可以正常工作了！这是一个简化版本，用于测试基本功能。'
  description.style.cssText = `
    font-size: 1rem;
    opacity: 0.7;
    text-align: center;
    max-width: 500px;
    line-height: 1.5;
    margin-bottom: 2rem;
  `
  
  // 创建导航按钮
  const navContainer = document.createElement('div')
  navContainer.style.cssText = `
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  `
  
  const pages = [
    { name: '主页', id: 'home' },
    { name: '统计', id: 'stats' },
    { name: '衣柜', id: 'wardrobe' },
    { name: '设置', id: 'settings' }
  ]
  
  pages.forEach(page => {
    const button = document.createElement('button')
    button.textContent = page.name
    button.style.cssText = `
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    `
    
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.3)'
      button.style.transform = 'scale(1.05)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(255, 255, 255, 0.2)'
      button.style.transform = 'scale(1)'
    })
    
    button.addEventListener('click', () => {
      alert(`你点击了${page.name}页面！\n\n这是${page.name}页面的占位内容。\n\n应用已成功启动，跳过按钮现在应该可以正常工作了！`)
    })
    
    navContainer.appendChild(button)
  })
  
  // 组装界面
  appContainer.appendChild(title)
  appContainer.appendChild(subtitle)
  appContainer.appendChild(description)
  appContainer.appendChild(navContainer)
  
  // 添加到页面
  document.body.appendChild(appContainer)
  
  console.log('Simple app interface created successfully')
}

// 初始化应用
async function initApp() {
  try {
    console.log('Starting app initialization...')
    
    // 检测系统语言并设置
    const systemLang = detectSystemLanguage()
    localStorage.setItem('language', systemLang)
    console.log('Language set to:', systemLang)
    
    // 检测系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light')
    console.log('Theme set to:', prefersDark ? 'dark' : 'light')
    
    // 创建简单应用界面
    createSimpleApp()
    
    console.log('App initialized successfully')
    
    // 隐藏加载屏幕
    hideLoadingScreen()
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // 即使出错也要隐藏加载屏幕
    hideLoadingScreen()
  }
}

// 立即设置跳过按钮事件（不等待DOMContentLoaded）
function setupSkipButton() {
  console.log('Setting up skip button immediately...')
  
  // 尝试立即找到按钮
  let skipButton = document.getElementById('skipButton')
  
  if (skipButton) {
    console.log('Skip button found immediately')
    bindSkipButton(skipButton)
  } else {
    // 如果还没找到，等待一下再试
    console.log('Skip button not found, waiting...')
    setTimeout(() => {
      skipButton = document.getElementById('skipButton')
      if (skipButton) {
        console.log('Skip button found after waiting')
        bindSkipButton(skipButton)
      } else {
        console.error('Skip button still not found!')
      }
    }, 100)
  }
}

// 绑定跳过按钮事件
function bindSkipButton(button) {
  console.log('Binding skip button events...')
  
  // 移除可能存在的旧事件监听器
  button.removeEventListener('click', handleSkipClick)
  
  // 添加新的事件监听器
  button.addEventListener('click', handleSkipClick)
  
  // 添加视觉反馈
  button.style.cursor = 'pointer'
  button.style.transition = 'all 0.3s ease'
  
  // 添加点击效果
  button.addEventListener('mousedown', () => {
    button.style.transform = 'scale(0.95)'
  })
  
  button.addEventListener('mouseup', () => {
    button.style.transform = 'scale(1)'
  })
  
  console.log('Skip button events bound successfully')
}

// 处理跳过按钮点击
function handleSkipClick() {
  console.log('Skip button clicked!')
  
  // 立即隐藏加载屏幕
  const loadingScreen = document.getElementById('loadingScreen')
  if (loadingScreen) {
    loadingScreen.style.display = 'none'
  }
  
  // 启动应用
  initApp()
}

// 等待DOM加载完成后再绑定事件
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up event listeners...')
  
  // 设置跳过按钮
  setupSkipButton()
  
  // 自动启动应用（3秒后）
  setTimeout(() => {
    console.log('Auto-starting app...')
    initApp()
  }, 3000)
})

// 如果DOM已经加载完成，立即设置
if (document.readyState === 'loading') {
  // DOM还在加载中
  console.log('DOM still loading...')
} else {
  // DOM已经加载完成
  console.log('DOM already loaded, setting up immediately...')
  setupSkipButton()
}

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme') === 'auto') {
    localStorage.setItem('theme', e.matches ? 'dark' : 'light')
    // 触发主题更新事件
    window.dispatchEvent(new CustomEvent('themeChange'))
  }
})