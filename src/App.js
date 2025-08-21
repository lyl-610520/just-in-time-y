import { Router } from './utils/Router.js'
import { ThemeManager } from './utils/ThemeManager.js'
import { LanguageManager } from './utils/LanguageManager.js'
import { DataManager } from './utils/DataManager.js'
import { WeatherManager } from './utils/WeatherManager.js'
import { NotificationManager } from './utils/NotificationManager.js'
import { AudioManager } from './utils/AudioManager.js'
import { BackgroundManager } from './components/BackgroundManager.js'
import { MusicPlayer } from './components/MusicPlayer.js'
import { Navigation } from './components/Navigation.js'

export class App {
  constructor() {
    this.router = null
    this.themeManager = null
    this.languageManager = null
    this.dataManager = null
    this.weatherManager = null
    this.notificationManager = null
    this.audioManager = null
    this.backgroundManager = null
    this.musicPlayer = null
    this.navigation = null
  }

  async init() {
    try {
      // 初始化各个管理器
      await this.initializeManagers()
      
      // 创建组件
      this.createComponents()
      
      // 初始化路由
      this.initRouter()
      
      // 启动后台任务
      this.startBackgroundTasks()
      
      // 请求通知权限
      await this.requestNotificationPermission()
      
      console.log('App initialized successfully')
    } catch (error) {
      console.error('Failed to initialize app:', error)
    }
  }

  async initializeManagers() {
    // 数据管理器
    this.dataManager = new DataManager()
    await this.dataManager.init()
    
    // 主题管理器
    this.themeManager = new ThemeManager()
    this.themeManager.init()
    
    // 语言管理器
    this.languageManager = new LanguageManager()
    this.languageManager.init()
    
    // 天气管理器
    this.weatherManager = new WeatherManager()
    await this.weatherManager.init()
    
    // 通知管理器
    this.notificationManager = new NotificationManager()
    await this.notificationManager.init()
    
    // 音频管理器
    this.audioManager = new AudioManager()
    await this.audioManager.init()
    
    // 将管理器挂载到全局，供组件使用
    window.dataManager = this.dataManager
    window.themeManager = this.themeManager
    window.languageManager = this.languageManager
    window.weatherManager = this.weatherManager
    window.notificationManager = this.notificationManager
    window.audioManager = this.audioManager
  }

  createComponents() {
    // 背景管理器
    this.backgroundManager = new BackgroundManager()
    this.backgroundManager.init()
    
    // 音乐播放器
    this.musicPlayer = new MusicPlayer()
    this.musicPlayer.init()
    
    // 导航栏
    this.navigation = new Navigation()
    this.navigation.init()
    
    // 创建页面容器
    this.createPageContainer()
  }

  createPageContainer() {
    const pageContainer = document.createElement('div')
    pageContainer.id = 'pageContainer'
    pageContainer.style.cssText = `
      position: relative;
      z-index: 1;
    `
    document.body.appendChild(pageContainer)
  }

  initRouter() {
    this.router = new Router()
    this.router.init()
    
    // 监听路由变化
    this.router.on('routeChange', (route) => {
      // 更新导航状态
      this.navigation?.updateActiveRoute(route)
      
      // 更新页面标题
      this.updatePageTitle(route)
    })
  }

  updatePageTitle(route) {
    const titles = {
      'home': this.languageManager.getText('pageTitle.home'),
      'stats': this.languageManager.getText('pageTitle.stats'),
      'wardrobe': this.languageManager.getText('pageTitle.wardrobe'),
      'settings': this.languageManager.getText('pageTitle.settings')
    }
    
    const title = titles[route] || this.languageManager.getText('appName')
    document.title = `${title} - Just In Time`
  }

  startBackgroundTasks() {
    // 每分钟检查一次时间相关任务
    setInterval(() => {
      this.checkTimeBasedTasks()
    }, 60000)
    
    // 每5分钟更新一次天气
    setInterval(() => {
      this.weatherManager?.updateWeather()
    }, 300000)
    
    // 每天凌晨重置打卡状态
    this.scheduleDailyReset()
  }

  checkTimeBasedTasks() {
    const now = new Date()
    const hour = now.getHours()
    
    // 检查闹钟
    this.checkAlarms()
    
    // 检查通知时间
    this.checkNotificationTime()
  }

  checkAlarms() {
    const alarms = this.dataManager.getAlarms()
    const now = new Date()
    
    alarms.forEach(alarm => {
      if (alarm.time <= now && !alarm.triggered) {
        this.triggerAlarm(alarm)
      }
    })
  }

  async triggerAlarm(alarm) {
    // 标记闹钟已触发
    alarm.triggered = true
    this.dataManager.updateAlarm(alarm)
    
    // 播放提示音
    this.audioManager?.playAlarmSound()
    
    // 发送通知
    if (this.notificationManager.hasPermission()) {
      await this.notificationManager.sendNotification({
        title: this.languageManager.getText('alarm.title'),
        body: this.languageManager.getText('alarm.body'),
        icon: '/pwa-192x192.png'
      })
    }
  }

  checkNotificationTime() {
    const settings = this.dataManager.getSettings()
    if (!settings.notificationTime) return
    
    const now = new Date()
    const notificationTime = new Date(settings.notificationTime)
    
    if (now.getHours() === notificationTime.getHours() && 
        now.getMinutes() === notificationTime.getMinutes()) {
      this.sendDailyNotification()
    }
  }

  async sendDailyNotification() {
    const settings = this.dataManager.getSettings()
    const today = new Date().toDateString()
    const todayCheckins = this.dataManager.getCheckinsByDate(today)
    
    let message = ''
    if (todayCheckins.length === 0) {
      message = this.languageManager.getText('notification.noCheckins')
    } else {
      message = this.languageManager.getText('notification.goodProgress')
    }
    
    if (this.notificationManager.hasPermission()) {
      await this.notificationManager.sendNotification({
        title: this.languageManager.getText('notification.daily'),
        body: message,
        icon: '/pwa-192x192.png'
      })
    }
  }

  scheduleDailyReset() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeUntilMidnight = tomorrow - now
    
    setTimeout(() => {
      this.resetDailyCheckins()
      // 设置每天重置
      this.scheduleDailyReset()
    }, timeUntilMidnight)
  }

  resetDailyCheckins() {
    this.dataManager.resetDailyCheckins()
  }

  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          console.log('Notification permission granted')
        }
      } catch (error) {
        console.error('Failed to request notification permission:', error)
      }
    }
  }
}