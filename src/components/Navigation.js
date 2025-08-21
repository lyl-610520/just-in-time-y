export class Navigation {
  constructor() {
    this.container = null
    this.activeRoute = 'home'
    this.eventListeners = {}
  }

  init() {
    this.createNavigation()
    this.bindEvents()
  }

  createNavigation() {
    this.container = document.createElement('nav')
    this.container.className = 'navigation glass'
    this.container.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 20px;
      z-index: 1000;
      box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
    `
    
    // 创建导航项
    const navItems = [
      { id: 'home', icon: '🏠', label: '首页' },
      { id: 'stats', icon: '📊', label: '统计' },
      { id: 'wardrobe', icon: '👗', label: '衣柜' },
      { id: 'settings', icon: '⚙️', label: '设置' }
    ]
    
    navItems.forEach(item => {
      const navItem = this.createNavItem(item)
      this.container.appendChild(navItem)
    })
    
    document.body.appendChild(this.container)
  }

  createNavItem(item) {
    const navItem = document.createElement('div')
    navItem.className = 'nav-item'
    navItem.dataset.route = item.id
    navItem.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 60px;
      position: relative;
    `
    
    const icon = document.createElement('div')
    icon.className = 'nav-icon'
    icon.innerHTML = item.icon
    icon.style.cssText = `
      font-size: 24px;
      margin-bottom: 4px;
      transition: all 0.3s ease;
    `
    
    const label = document.createElement('div')
    label.className = 'nav-label'
    label.textContent = item.label
    label.style.cssText = `
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      transition: all 0.3s ease;
    `
    
    // 活动状态指示器
    const indicator = document.createElement('div')
    indicator.className = 'nav-indicator'
    indicator.style.cssText = `
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 20px;
      height: 3px;
      background: linear-gradient(90deg, #4dabf7, #74c0fc);
      border-radius: 2px;
      transition: transform 0.3s ease;
    `
    
    navItem.appendChild(icon)
    navItem.appendChild(label)
    navItem.appendChild(indicator)
    
    // 设置初始状态
    if (item.id === this.activeRoute) {
      this.setActiveNavItem(navItem)
    }
    
    return navItem
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item')
      if (navItem) {
        const route = navItem.dataset.route
        this.navigateTo(route)
      }
    })
  }

  navigateTo(route) {
    if (route === this.activeRoute) return
    
    // 更新活动状态
    this.updateActiveRoute(route)
    
    // 触发路由变化事件
    this.emit('routeChange', route)
    
    // 更新URL
    window.location.hash = route
  }

  updateActiveRoute(route) {
    this.activeRoute = route
    
    // 更新所有导航项的状态
    const navItems = this.container.querySelectorAll('.nav-item')
    navItems.forEach(navItem => {
      if (navItem.dataset.route === route) {
        this.setActiveNavItem(navItem)
      } else {
        this.setInactiveNavItem(navItem)
      }
    })
  }

  setActiveNavItem(navItem) {
    const icon = navItem.querySelector('.nav-icon')
    const label = navItem.querySelector('.nav-label')
    const indicator = navItem.querySelector('.nav-indicator')
    
    // 图标动画
    icon.style.transform = 'scale(1.2)'
    icon.style.filter = 'drop-shadow(0 0 8px rgba(77, 171, 247, 0.6))'
    
    // 标签颜色
    label.style.color = '#ffffff'
    label.style.fontWeight = '600'
    
    // 指示器显示
    indicator.style.transform = 'translateX(-50%) scaleX(1)'
    
    // 背景效果
    navItem.style.background = 'rgba(255, 255, 255, 0.2)'
    navItem.style.transform = 'translateY(-4px)'
  }

  setInactiveNavItem(navItem) {
    const icon = navItem.querySelector('.nav-icon')
    const label = navItem.querySelector('.nav-label')
    const indicator = navItem.querySelector('.nav-indicator')
    
    // 重置图标
    icon.style.transform = 'scale(1)'
    icon.style.filter = 'none'
    
    // 重置标签
    label.style.color = 'rgba(255, 255, 255, 0.8)'
    label.style.fontWeight = '500'
    
    // 隐藏指示器
    indicator.style.transform = 'translateX(-50%) scaleX(0)'
    
    // 重置背景
    navItem.style.background = 'transparent'
    navItem.style.transform = 'translateY(0)'
  }

  // 添加悬停效果
  addHoverEffects() {
    const navItems = this.container.querySelectorAll('.nav-item')
    
    navItems.forEach(navItem => {
      navItem.addEventListener('mouseenter', () => {
        if (navItem.dataset.route !== this.activeRoute) {
          navItem.style.background = 'rgba(255, 255, 255, 0.1)'
          navItem.style.transform = 'translateY(-2px)'
        }
      })
      
      navItem.addEventListener('mouseleave', () => {
        if (navItem.dataset.route !== this.activeRoute) {
          navItem.style.background = 'transparent'
          navItem.style.transform = 'translateY(0)'
        }
      })
    })
  }

  // 获取当前活动路由
  getActiveRoute() {
    return this.activeRoute
  }

  // 显示/隐藏导航
  show() {
    this.container.style.transform = 'translateY(0)'
  }

  hide() {
    this.container.style.transform = 'translateY(100%)'
  }

  // 添加通知徽章
  addNotificationBadge(route, count) {
    const navItem = this.container.querySelector(`[data-route="${route}"]`)
    if (!navItem) return
    
    let badge = navItem.querySelector('.notification-badge')
    
    if (!badge) {
      badge = document.createElement('div')
      badge.className = 'notification-badge'
      badge.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        min-width: 18px;
        height: 18px;
        background: #ff6b6b;
        color: white;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 600;
        padding: 0 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      `
      navItem.appendChild(badge)
    }
    
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count.toString()
      badge.style.display = 'flex'
    } else {
      badge.style.display = 'none'
    }
  }

  // 移除通知徽章
  removeNotificationBadge(route) {
    const navItem = this.container.querySelector(`[data-route="${route}"]`)
    if (!navItem) return
    
    const badge = navItem.querySelector('.notification-badge')
    if (badge) {
      badge.remove()
    }
  }

  // 添加特殊效果（如成就解锁时的动画）
  addSpecialEffect(route, effect) {
    const navItem = this.container.querySelector(`[data-route="${route}"]`)
    if (!navItem) return
    
    switch (effect) {
      case 'pulse':
        this.addPulseEffect(navItem)
        break
      case 'shake':
        this.addShakeEffect(navItem)
        break
      case 'glow':
        this.addGlowEffect(navItem)
        break
    }
  }

  addPulseEffect(navItem) {
    navItem.style.animation = 'pulse 0.6s ease-in-out'
    setTimeout(() => {
      navItem.style.animation = ''
    }, 600)
  }

  addShakeEffect(navItem) {
    navItem.style.animation = 'shake 0.5s ease-in-out'
    setTimeout(() => {
      navItem.style.animation = ''
    }, 500)
  }

  addGlowEffect(navItem) {
    const icon = navItem.querySelector('.nav-icon')
    icon.style.filter = 'drop-shadow(0 0 20px rgba(77, 171, 247, 0.8))'
    setTimeout(() => {
      icon.style.filter = ''
    }, 2000)
  }

  // 响应式设计
  updateResponsive() {
    const isMobile = window.innerWidth <= 768
    
    if (isMobile) {
      this.container.style.height = '70px'
      this.container.style.padding = '0 10px'
      
      const navItems = this.container.querySelectorAll('.nav-item')
      navItems.forEach(navItem => {
        const icon = navItem.querySelector('.nav-icon')
        const label = navItem.querySelector('.nav-label')
        
        icon.style.fontSize = '20px'
        label.style.fontSize = '10px'
      })
    } else {
      this.container.style.height = '80px'
      this.container.style.padding = '0 20px'
      
      const navItems = this.container.querySelectorAll('.nav-item')
      navItems.forEach(navItem => {
        const icon = navItem.querySelector('.nav-icon')
        const label = navItem.querySelector('.nav-label')
        
        icon.style.fontSize = '24px'
        label.style.fontSize = '12px'
      })
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

  // 销毁组件
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    
    this.eventListeners = {}
  }
}

// 添加CSS动画
const style = document.createElement('style')
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`
document.head.appendChild(style)