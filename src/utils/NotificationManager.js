export class NotificationManager {
  constructor() {
    this.hasPermission = false
    this.eventListeners = {}
    
    // 绑定事件
    this.handlePermissionChange = this.handlePermissionChange.bind(this)
  }

  async init() {
    try {
      // 检查通知权限
      this.checkPermission()
      
      // 监听权限变化
      this.watchPermission()
      
      console.log('NotificationManager initialized successfully')
    } catch (error) {
      console.error('Failed to initialize NotificationManager:', error)
    }
  }

  checkPermission() {
    if ('Notification' in window) {
      this.hasPermission = Notification.permission === 'granted'
    } else {
      this.hasPermission = false
    }
    
    return this.hasPermission
  }

  watchPermission() {
    if ('Notification' in window) {
      // 监听权限变化（某些浏览器可能不支持）
      try {
        if (Notification.permission !== 'denied') {
          // 定期检查权限状态
          setInterval(() => {
            this.checkPermission()
          }, 30000) // 每30秒检查一次
        }
      } catch (error) {
        console.warn('Cannot watch notification permission:', error)
      }
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.hasPermission = permission === 'granted'
      
      // 触发权限变化事件
      this.emit('permissionChange', this.hasPermission)
      
      return this.hasPermission
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  async sendNotification(options) {
    if (!this.hasPermission) {
      console.warn('No notification permission')
      return false
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/pwa-192x192.png',
        badge: options.badge || '/pwa-192x192.png',
        tag: options.tag || 'just-in-time',
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        vibrate: options.vibrate || [200, 100, 200],
        data: options.data || {}
      })

      // 设置通知点击事件
      notification.onclick = (event) => {
        event.preventDefault()
        
        // 聚焦到应用窗口
        if (window.focus) {
          window.focus()
        }
        
        // 关闭通知
        notification.close()
        
        // 触发通知点击事件
        this.emit('notificationClick', {
          notification,
          data: options.data
        })
      }

      // 设置通知关闭事件
      notification.onclose = () => {
        this.emit('notificationClose', {
          notification,
          data: options.data
        })
      }

      // 设置通知错误事件
      notification.onerror = (error) => {
        console.error('Notification error:', error)
        this.emit('notificationError', {
          error,
          notification,
          data: options.data
        })
      }

      return notification
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    }
  }

  // 发送每日提醒通知
  async sendDailyReminder() {
    const now = new Date()
    const hour = now.getHours()
    
    let title = '每日提醒'
    let body = '记得打卡记录今天的心情哦'
    
    // 根据时间段调整提醒内容
    if (hour >= 6 && hour < 10) {
      title = '早安提醒'
      body = '新的一天开始了，记得打卡记录起床时间！'
    } else if (hour >= 10 && hour < 14) {
      title = '午间提醒'
      body = '中午了，记得吃午饭，也可以打卡记录一下！'
    } else if (hour >= 14 && hour < 18) {
      title = '下午提醒'
      body = '下午继续加油，记得打卡记录今天的收获！'
    } else if (hour >= 18 && hour < 22) {
      title = '晚间提醒'
      body = '晚上好，记得打卡记录今天的心情！'
    } else {
      title = '睡前提醒'
      body = '夜深了，记得打卡记录睡觉时间，晚安！'
    }
    
    return this.sendNotification({
      title,
      body,
      tag: 'daily-reminder',
      requireInteraction: false
    })
  }

  // 发送闹钟通知
  async sendAlarmNotification() {
    return this.sendNotification({
      title: '闹钟响了',
      body: '该起床了！新的一天开始了',
      tag: 'alarm',
      requireInteraction: true,
      vibrate: [500, 200, 500, 200, 500]
    })
  }

  // 发送成就解锁通知
  async sendAchievementNotification(achievement) {
    return this.sendNotification({
      title: '🎉 成就解锁！',
      body: `恭喜获得成就：${achievement.name}`,
      tag: 'achievement',
      requireInteraction: false,
      data: { achievement }
    })
  }

  // 发送连续打卡提醒
  async sendStreakNotification(streakDays) {
    let title = '🎯 连续打卡提醒'
    let body = ''
    
    if (streakDays === 3) {
      body = '已经连续打卡3天了，继续保持！'
    } else if (streakDays === 7) {
      body = '太棒了！已经连续打卡一周了！'
    } else if (streakDays === 30) {
      body = '哇！连续打卡一个月，你是真正的坚持者！'
    } else if (streakDays % 10 === 0) {
      body = `连续打卡${streakDays}天，继续加油！`
    } else {
      body = `已经连续打卡${streakDays}天了，好棒的！`
    }
    
    return this.sendNotification({
      title,
      body,
      tag: 'streak',
      requireInteraction: false
    })
  }

  // 发送天气相关通知
  async sendWeatherNotification(weather) {
    const condition = weather.condition.toLowerCase()
    let title = '天气提醒'
    let body = ''
    
    if (condition.includes('rain') || condition.includes('storm')) {
      title = '🌧️ 雨天提醒'
      body = '今天有雨，记得带伞出门哦！'
    } else if (condition.includes('snow')) {
      title = '❄️ 雪天提醒'
      body = '今天下雪了，注意保暖，小心路滑！'
    } else if (condition.includes('sun') && weather.temperature > 30) {
      title = '☀️ 高温提醒'
      body = '今天天气炎热，注意防暑降温！'
    } else if (weather.temperature < 0) {
      title = '❄️ 低温提醒'
      body = '今天天气寒冷，注意保暖！'
    }
    
    if (body) {
      return this.sendNotification({
        title,
        body,
        tag: 'weather',
        requireInteraction: false
      })
    }
    
    return null
  }

  // 发送自定义通知
  async sendCustomNotification(title, body, options = {}) {
    return this.sendNotification({
      title,
      body,
      ...options
    })
  }

  // 关闭所有通知
  closeAllNotifications() {
    if ('Notification' in window && this.hasPermission) {
      // 关闭所有当前通知
      // 注意：某些浏览器可能不支持此功能
      try {
        // 这里可以尝试关闭特定标签的通知
        // 但大多数浏览器会自动管理通知
      } catch (error) {
        console.warn('Cannot close notifications:', error)
      }
    }
  }

  // 检查是否支持通知
  isSupported() {
    return 'Notification' in window
  }

  // 获取权限状态
  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported'
    }
    return Notification.permission
  }

  // 设置通知偏好
  setNotificationPreferences(preferences) {
    // 保存用户的通知偏好设置
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences))
  }

  // 获取通知偏好
  getNotificationPreferences() {
    try {
      const stored = localStorage.getItem('notificationPreferences')
      return stored ? JSON.parse(stored) : {
        daily: true,
        achievements: true,
        weather: true,
        streaks: true,
        sound: true,
        vibration: true
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error)
      return {
        daily: true,
        achievements: true,
        weather: true,
        streaks: true,
        sound: true,
        vibration: true
      }
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

  handlePermissionChange() {
    this.checkPermission()
    this.emit('permissionChange', this.hasPermission)
  }

  destroy() {
    this.eventListeners = {}
  }
}