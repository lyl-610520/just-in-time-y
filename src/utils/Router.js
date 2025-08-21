import { gsap } from 'gsap'

export class Router {
  constructor() {
    this.routes = {
      'home': './components/HomePage.js',
      'stats': './components/StatsPage.js',
      'wardrobe': './components/WardrobePage.js',
      'settings': './components/SettingsPage.js'
    }
    
    this.currentRoute = 'home'
    this.currentPage = null
    this.isTransitioning = false
    this.eventListeners = {}
    
    // 绑定事件
    this.handleHashChange = this.handleHashChange.bind(this)
    this.handlePopState = this.handlePopState.bind(this)
  }

  init() {
    // 监听hash变化
    window.addEventListener('hashchange', this.handleHashChange)
    window.addEventListener('popstate', this.handlePopState)
    
    // 初始化路由
    this.handleHashChange()
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home'
    this.navigate(hash)
  }

  handlePopState() {
    const hash = window.location.hash.slice(1) || 'home'
    this.navigate(hash, false)
  }

  async navigate(route, updateHistory = true) {
    if (this.isTransitioning || route === this.currentRoute) return
    
    this.isTransitioning = true
    
    try {
      // 更新历史记录
      if (updateHistory) {
        window.location.hash = route
      }
      
      // 页面切换动画
      await this.transitionToPage(route)
      
      this.currentRoute = route
      this.emit('routeChange', route)
      
    } catch (error) {
      console.error('Navigation failed:', error)
    } finally {
      this.isTransitioning = false
    }
  }

  async transitionToPage(route) {
    const pageContainer = document.getElementById('pageContainer')
    if (!pageContainer) return
    
    // 页面退出动画
    if (this.currentPage) {
      await gsap.to(this.currentPage, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
    
    // 加载新页面
    const PageComponent = await this.loadPage(route)
    if (!PageComponent) return
    
    // 创建新页面实例
    const newPage = new PageComponent()
    
    // 渲染页面
    pageContainer.innerHTML = ''
    const pageElement = newPage.render()
    pageContainer.appendChild(pageElement)
    
    // 页面进入动画
    gsap.set(pageElement, { opacity: 0, y: 20 })
    await gsap.to(pageElement, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
    
    // 初始化页面
    if (typeof newPage.init === 'function') {
      newPage.init()
    }
    
    this.currentPage = pageElement
  }

  async loadPage(route) {
    try {
      const module = await import(this.routes[route])
      return module.default || module
    } catch (error) {
      console.error(`Failed to load page: ${route}`, error)
      // 返回404页面或默认页面
      return null
    }
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
    window.removeEventListener('hashchange', this.handleHashChange)
    window.removeEventListener('popstate', this.handlePopState)
  }
}