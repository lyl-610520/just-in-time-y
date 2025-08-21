export class LanguageManager {
  constructor() {
    this.currentLanguage = 'zh'
    this.translations = {
      zh: {
        // 应用名称
        appName: '恰逢其时',
        
        // 页面标题
        pageTitle: {
          home: '首页',
          stats: '统计',
          wardrobe: '衣柜',
          settings: '设置'
        },
        
        // 导航
        navigation: {
          home: '首页',
          stats: '统计',
          wardrobe: '衣柜',
          settings: '设置'
        },
        
        // 主页
        home: {
          greeting: {
            morning: '早上好！新的一天开始了',
            noon: '中午好！记得吃午饭哦',
            afternoon: '下午好！继续加油',
            evening: '晚上好！今天过得怎么样？',
            night: '夜深了，该休息了'
          },
          weather: '当前天气：{condition}，{temp}°C',
          weatherComfort: {
            sunny: '阳光明媚，心情也会变好呢',
            cloudy: '多云天气，适合外出散步',
            rainy: '下雨天，记得带伞哦',
            snowy: '下雪了，世界变得纯净美好'
          },
          checkin: {
            wakeUp: '我起床啦',
            sleep: '我要睡了',
            wakeUpSuccess: '早起的人儿最棒了！',
            sleepSuccess: '早睡早起身体好，晚安！',
            wakeUpMessage: '新的一天开始了，加油！',
            sleepMessage: '今天辛苦了，好好休息吧'
          },
          customCheckin: {
            title: '自定义打卡',
            placeholder: '输入打卡内容...',
            category: {
              life: '生活',
              study: '学习',
              work: '工作'
            },
            add: '添加',
            confirm: '确认重复打卡？',
            confirmText: '你已经打卡过这个内容了，确定要重复吗？'
          },
          alarm: {
            title: '设置闹钟',
            time: '时间',
            set: '设置',
            cancel: '取消'
          }
        },
        
        // 统计页
        stats: {
          title: '数据统计',
          categoryDistribution: '打卡类别分布',
          sleepTrend: '睡眠时长趋势',
          last7Days: '最近7天'
        },
        
        // 衣柜页
        wardrobe: {
          title: '衣柜与商店',
          pet: '宠物',
          accessories: '配饰',
          themes: '主题',
          achievements: '成就',
          points: '成就点',
          unlock: '解锁',
          equipped: '已装备'
        },
        
        // 设置页
        settings: {
          title: '设置',
          display: {
            title: '显示与语言',
            theme: '主题',
            language: '语言',
            auto: '自动',
            light: '浅色',
            dark: '深色'
          },
          personalization: {
            title: '个性化',
            petName: '宠物名称',
            weatherPreference: '天气偏好',
            likeRain: '喜欢雨天',
            dislikeRain: '讨厌雨天'
          },
          countdown: {
            title: '倒计时设置',
            event: '事件名称',
            date: '日期',
            set: '设置'
          },
          notifications: {
            title: '智能通知',
            dailyTime: '每日提醒时间',
            requestPermission: '申请通知权限',
            permissionGranted: '权限已获得',
            permissionDenied: '权限被拒绝'
          },
          data: {
            title: '数据管理',
            reset: '回到最初的时光',
            resetConfirm: '这样做会清除所有数据，确定要继续吗？',
            resetSuccess: '你即将涅槃重生，恭喜进入下一阶段',
            thinkAgain: '我再想想',
            iUnderstand: '我明白'
          },
          sound: {
            title: '音效设置',
            enable: '启用音效',
            disable: '关闭音效'
          }
        },
        
        // 通知
        notification: {
          daily: '每日提醒',
          noCheckins: '今天还没有打卡哦，记得记录一下今天的心情',
          goodProgress: '今天已经打卡了，继续保持！',
          alarm: {
            title: '闹钟响了',
            body: '该起床了！新的一天开始了'
          }
        },
        
        // 通用
        common: {
          save: '保存',
          cancel: '取消',
          confirm: '确认',
          delete: '删除',
          edit: '编辑',
          close: '关闭',
          loading: '加载中...',
          error: '出错了',
          success: '成功',
          yes: '是',
          no: '否'
        }
      },
      
      en: {
        // App name
        appName: 'Just In Time',
        
        // Page titles
        pageTitle: {
          home: 'Home',
          stats: 'Statistics',
          wardrobe: 'Wardrobe',
          settings: 'Settings'
        },
        
        // Navigation
        navigation: {
          home: 'Home',
          stats: 'Stats',
          wardrobe: 'Wardrobe',
          settings: 'Settings'
        },
        
        // Home page
        home: {
          greeting: {
            morning: 'Good morning! A new day begins',
            noon: 'Good afternoon! Remember to have lunch',
            afternoon: 'Good afternoon! Keep going',
            evening: 'Good evening! How was your day?',
            night: 'It\'s late, time to rest'
          },
          weather: 'Current weather: {condition}, {temp}°C',
          weatherComfort: {
            sunny: 'Sunny weather, mood will be better',
            cloudy: 'Cloudy weather, perfect for a walk',
            rainy: 'It\'s raining, remember to bring an umbrella',
            snowy: 'It\'s snowing, the world becomes pure and beautiful'
          },
          checkin: {
            wakeUp: 'I\'m up',
            sleep: 'I\'m going to sleep',
            wakeUpSuccess: 'Early risers are the best!',
            sleepSuccess: 'Early to bed, early to rise, good night!',
            wakeUpMessage: 'A new day begins, keep going!',
            sleepMessage: 'You\'ve worked hard today, rest well'
          },
          customCheckin: {
            title: 'Custom Check-in',
            placeholder: 'Enter check-in content...',
            category: {
              life: 'Life',
              study: 'Study',
              work: 'Work'
            },
            add: 'Add',
            confirm: 'Confirm duplicate check-in?',
            confirmText: 'You\'ve already checked in this content, sure to repeat?'
          },
          alarm: {
            title: 'Set Alarm',
            time: 'Time',
            set: 'Set',
            cancel: 'Cancel'
          }
        },
        
        // Stats page
        stats: {
          title: 'Statistics',
          categoryDistribution: 'Check-in Category Distribution',
          sleepTrend: 'Sleep Duration Trend',
          last7Days: 'Last 7 Days'
        },
        
        // Wardrobe page
        wardrobe: {
          title: 'Wardrobe & Shop',
          pet: 'Pet',
          accessories: 'Accessories',
          themes: 'Themes',
          achievements: 'Achievements',
          points: 'Achievement Points',
          unlock: 'Unlock',
          equipped: 'Equipped'
        },
        
        // Settings page
        settings: {
          title: 'Settings',
          display: {
            title: 'Display & Language',
            theme: 'Theme',
            language: 'Language',
            auto: 'Auto',
            light: 'Light',
            dark: 'Dark'
          },
          personalization: {
            title: 'Personalization',
            petName: 'Pet Name',
            weatherPreference: 'Weather Preference',
            likeRain: 'Like Rain',
            dislikeRain: 'Dislike Rain'
          },
          countdown: {
            title: 'Countdown Settings',
            event: 'Event Name',
            date: 'Date',
            set: 'Set'
          },
          notifications: {
            title: 'Smart Notifications',
            dailyTime: 'Daily Reminder Time',
            requestPermission: 'Request Notification Permission',
            permissionGranted: 'Permission Granted',
            permissionDenied: 'Permission Denied'
          },
          data: {
            title: 'Data Management',
            reset: 'Back to the Beginning',
            resetConfirm: 'This will clear all data, are you sure to continue?',
            resetSuccess: 'You are about to be reborn, congratulations on entering the next stage',
            thinkAgain: 'Let me think again',
            iUnderstand: 'I understand'
          },
          sound: {
            title: 'Sound Settings',
            enable: 'Enable Sound',
            disable: 'Disable Sound'
          }
        },
        
        // Notifications
        notification: {
          daily: 'Daily Reminder',
          noCheckins: 'No check-ins today, remember to record your mood',
          goodProgress: 'You\'ve checked in today, keep it up!',
          alarm: {
            title: 'Alarm',
            body: 'Time to wake up! A new day begins'
          }
        },
        
        // Common
        common: {
          save: 'Save',
          cancel: 'Cancel',
          confirm: 'Confirm',
          delete: 'Delete',
          edit: 'Edit',
          close: 'Close',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          yes: 'Yes',
          no: 'No'
        }
      }
    }
    
    this.eventListeners = {}
  }

  init() {
    // 从localStorage获取保存的语言
    const savedLanguage = localStorage.getItem('language') || 'zh'
    this.setLanguage(savedLanguage)
  }

  setLanguage(language) {
    if (!this.translations[language]) {
      console.warn(`Language ${language} not supported, falling back to zh`)
      language = 'zh'
    }
    
    this.currentLanguage = language
    localStorage.setItem('language', language)
    
    // 更新HTML lang属性
    document.documentElement.lang = language
    
    // 触发语言变化事件
    this.emit('languageChange', language)
  }

  getText(key, params = {}) {
    const keys = key.split('.')
    let value = this.translations[this.currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value[k] !== undefined) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }
    
    if (typeof value === 'string') {
      // 替换参数
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match
      })
    }
    
    return value
  }

  getCurrentLanguage() {
    return this.currentLanguage
  }

  getSupportedLanguages() {
    return Object.keys(this.translations)
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
    this.eventListeners = {}
  }
}