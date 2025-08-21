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

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...')
  
  // 获取元素
  const loadingScreen = document.getElementById('loadingScreen')
  const skipButton = document.getElementById('skipButton')
  
  console.log('Loading screen:', loadingScreen)
  console.log('Skip button:', skipButton)
  
  // 设置跳过按钮事件
  if (skipButton) {
    console.log('Setting up skip button...')
    skipButton.addEventListener('click', function() {
      console.log('Skip button clicked!')
      hideLoadingScreen()
      startApp()
    })
    console.log('Skip button event bound successfully')
  } else {
    console.error('Skip button not found!')
  }
  
  // 3秒后自动启动
  setTimeout(function() {
    console.log('Auto-starting app...')
    startApp()
  }, 3000)
})

// 隐藏加载屏幕
function hideLoadingScreen() {
  console.log('Hiding loading screen...')
  const loadingScreen = document.getElementById('loadingScreen')
  if (loadingScreen) {
    loadingScreen.style.opacity = '0'
    loadingScreen.style.transition = 'opacity 0.5s ease-out'
    setTimeout(function() {
      loadingScreen.style.display = 'none'
    }, 500)
  }
}

// 启动应用
function startApp() {
  console.log('Starting app...')
  
  try {
    // 创建应用容器
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
    
    pages.forEach(function(page) {
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
      
      button.addEventListener('mouseenter', function() {
        button.style.background = 'rgba(255, 255, 255, 0.3)'
        button.style.transform = 'scale(1.05)'
      })
      
      button.addEventListener('mouseleave', function() {
        button.style.background = 'rgba(255, 255, 255, 0.2)'
        button.style.transform = 'scale(1)'
      })
      
      button.addEventListener('click', function() {
        alert('你点击了' + page.name + '页面！\n\n这是' + page.name + '页面的占位内容。\n\n应用已成功启动，跳过按钮现在应该可以正常工作了！')
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
    
    console.log('App started successfully!')
    
  } catch (error) {
    console.error('Failed to start app:', error)
  }
}

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme') === 'auto') {
    localStorage.setItem('theme', e.matches ? 'dark' : 'light')
    // 触发主题更新事件
    window.dispatchEvent(new CustomEvent('themeChange'))
  }
})