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

// 创建完整的应用界面
function createFullApp() {
  console.log('Creating full app interface...')
  
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
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 1;
    overflow-y: auto;
  `
  
  // 创建顶部导航
  const topNav = document.createElement('div')
  topNav.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  `
  
  const appTitle = document.createElement('h1')
  appTitle.textContent = 'Just In Time - 恰逢其时'
  appTitle.style.cssText = `
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0;
  `
  
  const timeDisplay = document.createElement('div')
  timeDisplay.id = 'timeDisplay'
  timeDisplay.style.cssText = `
    font-size: 1.2rem;
    opacity: 0.8;
  `
  
  topNav.appendChild(appTitle)
  topNav.appendChild(timeDisplay)
  
  // 创建主内容区域
  const mainContent = document.createElement('div')
  mainContent.style.cssText = `
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  `
  
  // 创建问候语
  const greeting = document.createElement('div')
  greeting.id = 'greeting'
  greeting.style.cssText = `
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
  `
  
  // 创建天气信息
  const weatherInfo = document.createElement('div')
  weatherInfo.id = 'weatherInfo'
  weatherInfo.style.cssText = `
    font-size: 1.1rem;
    opacity: 0.8;
    text-align: center;
    margin-bottom: 2rem;
  `
  
  // 创建打卡区域
  const checkinSection = document.createElement('div')
  checkinSection.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    margin-bottom: 2rem;
  `
  
  const checkinTitle = document.createElement('h2')
  checkinTitle.textContent = '今日打卡'
  checkinTitle.style.cssText = `
    font-size: 1.5rem;
    margin-bottom: 1rem;
  `
  
  const checkinButtons = document.createElement('div')
  checkinButtons.style.cssText = `
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  `
  
  const quickCheckins = [
    { text: '我起床啦', id: 'wakeup', color: '#4CAF50' },
    { text: '我要睡了', id: 'sleep', color: '#2196F3' }
  ]
  
  quickCheckins.forEach(checkin => {
    const button = document.createElement('button')
    button.textContent = checkin.text
    button.id = checkin.id
    button.style.cssText = `
      padding: 1rem 2rem;
      background: ${checkin.color};
      border: none;
      color: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      font-weight: 500;
    `
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)'
      button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)'
      button.style.boxShadow = 'none'
    })
    
    button.addEventListener('click', () => {
      handleQuickCheckin(checkin.id, checkin.text)
    })
    
    checkinButtons.appendChild(button)
  })
  
  // 创建自定义打卡
  const customCheckin = document.createElement('div')
  customCheckin.style.cssText = `
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 1rem;
  `
  
  const customInput = document.createElement('input')
  customInput.placeholder = '输入打卡内容...'
  customInput.style.cssText = `
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    min-width: 200px;
  `
  
  const customButton = document.createElement('button')
  customButton.textContent = '添加'
  customButton.style.cssText = `
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  `
  
  customButton.addEventListener('click', () => {
    handleCustomCheckin(customInput.value)
    customInput.value = ''
  })
  
  customCheckin.appendChild(customInput)
  customCheckin.appendChild(customButton)
  
  // 创建游戏化面板
  const gamePanel = document.createElement('div')
  gamePanel.style.cssText = `
    display: flex;
    gap: 2rem;
    align-items: center;
    margin-top: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  `
  
  const petInfo = document.createElement('div')
  petInfo.style.cssText = `
    text-align: center;
  `
  
  const petName = document.createElement('div')
  petName.textContent = '小宠物'
  petName.style.cssText = `
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  `
  
  const petAccessory = document.createElement('div')
  petAccessory.textContent = '🌸 春季配饰'
  petAccessory.style.cssText = `
    font-size: 1rem;
    opacity: 0.8;
  `
  
  petInfo.appendChild(petName)
  petInfo.appendChild(petAccessory)
  
  const flowerInfo = document.createElement('div')
  flowerInfo.style.cssText = `
    text-align: center;
  `
  
  const flowerLevel = document.createElement('div')
  flowerLevel.textContent = '花朵等级'
  flowerLevel.style.cssText = `
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  `
  
  const flowerStatus = document.createElement('div')
  flowerStatus.textContent = '🌱 小苗'
  flowerStatus.style.cssText = `
    font-size: 1rem;
    opacity: 0.8;
  `
  
  flowerInfo.appendChild(flowerLevel)
  flowerInfo.appendChild(flowerStatus)
  
  gamePanel.appendChild(petInfo)
  gamePanel.appendChild(flowerInfo)
  
  // 创建底部导航
  const bottomNav = document.createElement('div')
  bottomNav.style.cssText = `
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  `
  
  const navItems = [
    { text: '主页', icon: '🏠' },
    { text: '统计', icon: '📊' },
    { text: '衣柜', icon: '👕' },
    { text: '设置', icon: '⚙️' }
  ]
  
  navItems.forEach(item => {
    const navItem = document.createElement('div')
    navItem.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0.5rem;
      border-radius: 10px;
    `
    
    const icon = document.createElement('div')
    icon.textContent = item.icon
    icon.style.cssText = `
      font-size: 1.5rem;
    `
    
    const text = document.createElement('div')
    text.textContent = item.text
    text.style.cssText = `
      font-size: 0.9rem;
      opacity: 0.8;
    `
    
    navItem.appendChild(icon)
    navItem.appendChild(text)
    
    navItem.addEventListener('mouseenter', () => {
      navItem.style.background = 'rgba(255, 255, 255, 0.1)'
    })
    
    navItem.addEventListener('mouseleave', () => {
      navItem.style.background = 'transparent'
    })
    
    navItem.addEventListener('click', () => {
      alert(`你点击了${item.text}页面！\n\n这是${item.text}页面的占位内容。\n\n应用已成功启动！`)
    })
    
    bottomNav.appendChild(navItem)
  })
  
  // 组装界面
  checkinSection.appendChild(checkinTitle)
  checkinSection.appendChild(checkinButtons)
  checkinSection.appendChild(customCheckin)
  
  mainContent.appendChild(greeting)
  mainContent.appendChild(weatherInfo)
  mainContent.appendChild(checkinSection)
  mainContent.appendChild(gamePanel)
  
  appContainer.appendChild(topNav)
  appContainer.appendChild(mainContent)
  appContainer.appendChild(bottomNav)
  
  // 添加到页面
  document.body.appendChild(appContainer)
  
  // 启动时钟
  startClock()
  
  // 更新问候语
  updateGreeting()
  
  // 更新天气信息
  updateWeatherInfo()
  
  console.log('Full app interface created successfully')
}

// 启动时钟
function startClock() {
  const timeDisplay = document.getElementById('timeDisplay')
  if (!timeDisplay) return
  
  function updateTime() {
    const now = new Date()
    const timeString = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    timeDisplay.textContent = timeString
  }
  
  updateTime()
  setInterval(updateTime, 1000)
}

// 更新问候语
function updateGreeting() {
  const greeting = document.getElementById('greeting')
  if (!greeting) return
  
  const hour = new Date().getHours()
  let greetingText = ''
  
  if (hour >= 5 && hour < 12) {
    greetingText = '早上好！新的一天开始了 🌅'
  } else if (hour >= 12 && hour < 18) {
    greetingText = '下午好！继续加油 💪'
  } else if (hour >= 18 && hour < 22) {
    greetingText = '晚上好！今天过得怎么样？ 🌙'
  } else {
    greetingText = '夜深了，该休息了 😴'
  }
  
  greeting.textContent = greetingText
}

// 更新天气信息
function updateWeatherInfo() {
  const weatherInfo = document.getElementById('weatherInfo')
  if (!weatherInfo) return
  
  // 模拟天气信息
  const weatherConditions = [
    '☀️ 晴天，适合外出活动',
    '🌧️ 雨天，记得带伞',
    '⛅ 多云，天气不错',
    '🌤️ 晴间多云，适合散步'
  ]
  
  const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
  weatherInfo.textContent = `当前天气：${randomWeather}`
}

// 处理快捷打卡
function handleQuickCheckin(type, text) {
  const button = document.getElementById(type)
  if (!button) return
  
  // 禁用按钮
  button.disabled = true
  button.style.opacity = '0.5'
  button.style.cursor = 'not-allowed'
  
  // 显示成功消息
  showToast(`打卡成功：${text}！`)
  
  // 3秒后重新启用按钮
  setTimeout(() => {
    button.disabled = false
    button.style.opacity = '1'
    button.style.cursor = 'pointer'
  }, 3000)
}

// 处理自定义打卡
function handleCustomCheckin(content) {
  if (!content.trim()) {
    showToast('请输入打卡内容！')
    return
  }
  
  showToast(`自定义打卡成功：${content}`)
}

// 显示提示消息
function showToast(message) {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1rem 2rem;
    border-radius: 25px;
    z-index: 10000;
    font-size: 1rem;
  `
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.remove()
  }, 3000)
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
    
    // 创建完整应用界面
    createFullApp()
    
    console.log('App initialized successfully')
    
    // 隐藏加载屏幕
    hideLoadingScreen()
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // 即使出错也要隐藏加载屏幕
    hideLoadingScreen()
  }
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

// 设置跳过按钮事件
function setupSkipButton() {
  console.log('Setting up skip button...')
  
  const skipButton = document.getElementById('skipButton')
  if (skipButton) {
    console.log('Skip button found, binding events...')
    
    // 移除可能存在的旧事件监听器
    skipButton.removeEventListener('click', handleSkipClick)
    
    // 添加新的事件监听器
    skipButton.addEventListener('click', handleSkipClick)
    
    // 添加视觉反馈
    skipButton.style.cursor = 'pointer'
    
    console.log('Skip button events bound successfully')
  } else {
    console.error('Skip button not found!')
  }
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

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('theme') === 'auto') {
    localStorage.setItem('theme', e.matches ? 'dark' : 'light')
    // 触发主题更新事件
    window.dispatchEvent(new CustomEvent('themeChange'))
  }
})