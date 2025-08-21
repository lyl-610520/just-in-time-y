export class ThemeManager {
  constructor() {
    this.currentTheme = 'auto'
    this.isDark = false
    this.eventListeners = {}
    
    // 绑定事件
    this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this)
  }

  init() {
    // 从localStorage获取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'auto'
    this.setTheme(savedTheme)
    
    // 监听系统主题变化
    this.watchSystemTheme()
    
    // 监听主题变化事件
    window.addEventListener('themeChange', this.handleSystemThemeChange)
  }

  setTheme(theme) {
    this.currentTheme = theme
    localStorage.setItem('theme', theme)
    
    // 应用主题
    this.applyTheme()
    
    // 触发主题变化事件
    this.emit('themeChange', this.isDark)
  }

  applyTheme() {
    const root = document.documentElement
    const body = document.body
    
    if (this.currentTheme === 'auto') {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      this.isDark = this.currentTheme === 'dark'
    }
    
    // 设置CSS变量
    if (this.isDark) {
      root.classList.add('theme-dark')
      root.classList.remove('theme-light')
      body.classList.add('dark-mode')
      body.classList.remove('light-mode')
    } else {
      root.classList.add('theme-light')
      root.classList.remove('theme-dark')
      body.classList.add('light-mode')
      body.classList.remove('dark-mode')
    }
    
    // 更新meta标签
    this.updateMetaTheme()
  }

  updateMetaTheme() {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', this.isDark ? '#000000' : '#ffffff')
    }
    
    const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (metaStatusBar) {
      metaStatusBar.setAttribute('content', this.isDark ? 'black-translucent' : 'default')
    }
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', this.handleSystemThemeChange)
  }

  handleSystemThemeChange() {
    if (this.currentTheme === 'auto') {
      this.applyTheme()
      this.emit('themeChange', this.isDark)
    }
  }

  getCurrentTheme() {
    return this.currentTheme
  }

  isDarkMode() {
    return this.isDark
  }

  toggleTheme() {
    const themes = ['auto', 'light', 'dark']
    const currentIndex = themes.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    this.setTheme(themes[nextIndex])
  }

  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  emit(event, data) {
    const listeners = this.eventListeners[event]
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }

  destroy() {
    window.removeEventListener('themeChange', this.handleSystemThemeChange)
  }
}