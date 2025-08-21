export class DataManager {
  constructor() {
    this.storageKey = 'justInTimeData'
    this.defaultData = {
      settings: {
        theme: 'auto',
        language: 'zh',
        petName: '小精灵',
        weatherPreference: 'likeRain',
        notificationTime: '09:00',
        soundEnabled: true
      },
      checkins: [],
      alarms: [],
      achievements: [],
      pet: {
        name: '小精灵',
        accessories: ['spring_grass', 'summer_fan', 'autumn_fruit', 'winter_scarf'],
        equipped: 'spring_grass'
      },
      flower: {
        level: 1,
        name: '种子',
        sunlight: 0,
        maxSunlight: 100
      },
      music: {
        playlist: [
          { id: 'track1', name: '曲目一', src: '/src/assets/audio/track1.mp3', type: 'builtin' },
          { id: 'track2', name: '曲目二', src: '/src/assets/audio/track2.mp3', type: 'builtin' },
          { id: 'track3', name: '曲目三', src: '/src/assets/audio/track3.mp3', type: 'builtin' }
        ],
        currentTrack: 0,
        volume: 0.7
      },
      countdown: null,
      stats: {
        totalCheckins: 0,
        streakDays: 0,
        lastCheckinDate: null
      }
    }
    
    this.data = null
  }

  async init() {
    try {
      await this.loadData()
      console.log('DataManager initialized successfully')
    } catch (error) {
      console.error('Failed to initialize DataManager:', error)
      // 如果加载失败，使用默认数据
      this.data = { ...this.defaultData }
      await this.saveData()
    }
  }

  async loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.data = JSON.parse(stored)
        // 合并默认数据，确保新增字段存在
        this.data = this.mergeWithDefaults(this.data)
      } else {
        this.data = { ...this.defaultData }
        await this.saveData()
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      this.data = { ...this.defaultData }
      await this.saveData()
    }
  }

  mergeWithDefaults(storedData) {
    const merged = { ...this.defaultData }
    
    // 递归合并对象
    for (const key in storedData) {
      if (storedData.hasOwnProperty(key)) {
        if (typeof storedData[key] === 'object' && storedData[key] !== null && !Array.isArray(storedData[key])) {
          merged[key] = this.mergeWithDefaults(storedData[key])
        } else {
          merged[key] = storedData[key]
        }
      }
    }
    
    return merged
  }

  async saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data))
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }

  // 设置相关方法
  getSettings() {
    return this.data.settings
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings }
    this.saveData()
  }

  // 打卡相关方法
  addCheckin(checkin) {
    const newCheckin = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...checkin
    }
    
    this.data.checkins.push(newCheckin)
    this.data.stats.totalCheckins++
    
    // 更新连续打卡天数
    this.updateStreak(newCheckin.timestamp)
    
    // 增加花朵阳光值
    this.addSunlight(checkin.type)
    
    // 检查成就
    this.checkAchievements()
    
    this.saveData()
    return newCheckin
  }

  getCheckinsByDate(date) {
    const targetDate = new Date(date).toDateString()
    return this.data.checkins.filter(checkin => {
      const checkinDate = new Date(checkin.timestamp).toDateString()
      return checkinDate === targetDate
    })
  }

  getCheckinsByType(type) {
    return this.data.checkins.filter(checkin => checkin.type === type)
  }

  getAllCheckins() {
    return this.data.checkins
  }

  // 闹钟相关方法
  addAlarm(time) {
    const alarm = {
      id: Date.now().toString(),
      time: new Date(time),
      triggered: false
    }
    
    this.data.alarms.push(alarm)
    this.saveData()
    return alarm
  }

  getAlarms() {
    return this.data.alarms
  }

  updateAlarm(alarm) {
    const index = this.data.alarms.findIndex(a => a.id === alarm.id)
    if (index !== -1) {
      this.data.alarms[index] = alarm
      this.saveData()
    }
  }

  deleteAlarm(alarmId) {
    this.data.alarms = this.data.alarms.filter(a => a.id !== alarmId)
    this.saveData()
  }

  // 成就相关方法
  addAchievement(achievement) {
    const newAchievement = {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      unlockedAt: new Date().toISOString(),
      points: achievement.points || 0
    }
    
    this.data.achievements.push(newAchievement)
    this.saveData()
    return newAchievement
  }

  getAchievements() {
    return this.data.achievements
  }

  hasAchievement(achievementId) {
    return this.data.achievements.some(a => a.id === achievementId)
  }

  getAchievementPoints() {
    return this.data.achievements.reduce((total, a) => total + a.points, 0)
  }

  // 宠物相关方法
  getPet() {
    return this.data.pet
  }

  updatePet(petData) {
    this.data.pet = { ...this.data.pet, ...petData }
    this.saveData()
  }

  equipAccessory(accessoryId) {
    this.data.pet.equipped = accessoryId
    this.saveData()
  }

  // 花朵相关方法
  getFlower() {
    return this.data.flower
  }

  addSunlight(type) {
    let amount = 10 // 默认打卡增加10点阳光
    
    if (type === 'sleep') {
      amount = 25 // 睡觉打卡增加25点阳光
    } else if (type === 'wakeUp') {
      amount = 20 // 起床打卡增加20点阳光
    }
    
    this.data.flower.sunlight += amount
    
    // 检查是否升级
    this.checkFlowerLevelUp()
    
    this.saveData()
  }

  checkFlowerLevelUp() {
    const flower = this.data.flower
    const levels = [
      { level: 1, name: '种子', maxSunlight: 100 },
      { level: 2, name: '出芽', maxSunlight: 250 },
      { level: 3, name: '小苗', maxSunlight: 500 },
      { level: 4, name: '花骨朵', maxSunlight: 1000 },
      { level: 5, name: '开花', maxSunlight: 2000 }
    ]
    
    for (let i = levels.length - 1; i >= 0; i--) {
      if (flower.sunlight >= levels[i].maxSunlight && flower.level < levels[i].level) {
        flower.level = levels[i].level
        flower.name = levels[i].name
        flower.maxSunlight = levels[i].maxSunlight
        
        // 解锁升级成就
        this.unlockLevelUpAchievement(levels[i].level)
        break
      }
    }
  }

  unlockLevelUpAchievement(level) {
    const achievementId = `flower_level_${level}`
    if (!this.hasAchievement(achievementId)) {
      this.addAchievement({
        id: achievementId,
        name: `花朵成长 Lv.${level}`,
        description: `花朵已经成长到第${level}级了！`,
        points: level * 10
      })
    }
  }

  // 音乐相关方法
  getMusic() {
    return this.data.music
  }

  addMusicTrack(track) {
    const newTrack = {
      id: Date.now().toString(),
      name: track.name,
      src: track.src,
      type: 'custom',
      timestamp: new Date().toISOString()
    }
    
    this.data.music.playlist.push(newTrack)
    this.saveData()
    return newTrack
  }

  removeMusicTrack(trackId) {
    this.data.music.playlist = this.data.music.playlist.filter(t => t.id !== trackId)
    this.saveData()
  }

  updateMusicSettings(settings) {
    this.data.music = { ...this.data.music, ...settings }
    this.saveData()
  }

  // 倒计时相关方法
  getCountdown() {
    return this.data.countdown
  }

  setCountdown(countdown) {
    this.data.countdown = countdown
    this.saveData()
  }

  clearCountdown() {
    this.data.countdown = null
    this.saveData()
  }

  // 统计相关方法
  getStats() {
    return this.data.stats
  }

  updateStreak(timestamp) {
    const today = new Date(timestamp).toDateString()
    const lastDate = this.data.stats.lastCheckinDate
    
    if (lastDate) {
      const lastCheckinDate = new Date(lastDate).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (today === yesterdayStr) {
        this.data.stats.streakDays++
      } else if (today !== lastCheckinDate) {
        this.data.stats.streakDays = 1
      }
    } else {
      this.data.stats.streakDays = 1
    }
    
    this.data.stats.lastCheckinDate = timestamp
  }

  // 成就检查
  checkAchievements() {
    this.checkCheckinAchievements()
    this.checkStreakAchievements()
    this.checkTimeBasedAchievements()
  }

  checkCheckinAchievements() {
    const totalCheckins = this.data.stats.totalCheckins
    
    // 打卡次数成就
    const checkinAchievements = [
      { id: 'first_checkin', count: 1, name: '初次打卡', description: '完成了第一次打卡！', points: 10 },
      { id: 'checkin_10', count: 10, name: '打卡达人', description: '完成了10次打卡！', points: 20 },
      { id: 'checkin_50', count: 50, name: '打卡专家', description: '完成了50次打卡！', points: 50 },
      { id: 'checkin_100', count: 100, name: '打卡大师', description: '完成了100次打卡！', points: 100 }
    ]
    
    checkinAchievements.forEach(achievement => {
      if (totalCheckins >= achievement.count && !this.hasAchievement(achievement.id)) {
        this.addAchievement(achievement)
      }
    })
  }

  checkStreakAchievements() {
    const streakDays = this.data.stats.streakDays
    
    // 连续打卡成就
    const streakAchievements = [
      { id: 'streak_3', days: 3, name: '坚持不懈', description: '连续打卡3天！', points: 15 },
      { id: 'streak_7', days: 7, name: '一周坚持', description: '连续打卡7天！', points: 30 },
      { id: 'streak_30', days: 30, name: '月度达人', description: '连续打卡30天！', points: 100 }
    ]
    
    streakAchievements.forEach(achievement => {
      if (streakDays >= achievement.days && !this.hasAchievement(achievement.id)) {
        this.addAchievement(achievement)
      }
    })
  }

  checkTimeBasedAchievements() {
    const checkins = this.data.checkins
    const now = new Date()
    
    // 检查早起成就
    const morningCheckins = checkins.filter(checkin => {
      if (checkin.type !== 'wakeUp') return false
      const checkinTime = new Date(checkin.timestamp)
      const hour = checkinTime.getHours()
      return hour >= 6 && hour <= 9
    })
    
    if (morningCheckins.length >= 3 && !this.hasAchievement('early_bird')) {
      this.addAchievement({
        id: 'early_bird',
        name: '一日之计在于晨',
        description: '连续3次在6-9点起床打卡！',
        points: 25
      })
    }
    
    // 检查早睡成就
    const nightCheckins = checkins.filter(checkin => {
      if (checkin.type !== 'sleep') return false
      const checkinTime = new Date(checkin.timestamp)
      const hour = checkinTime.getHours()
      return hour >= 22 || hour <= 2
    })
    
    if (nightCheckins.length >= 3 && !this.hasAchievement('early_sleeper')) {
      this.addAchievement({
        id: 'early_sleeper',
        name: '早睡早起身体好',
        description: '连续3次在22-2点睡觉打卡！',
        points: 25
      })
    }
  }

  // 重置数据
  resetAllData() {
    this.data = { ...this.defaultData }
    this.saveData()
  }

  // 获取连续打卡天数
  getStreakDays() {
    return this.data.stats.streakDays
  }

  // 获取今日打卡状态
  getTodayCheckinStatus() {
    const today = new Date().toDateString()
    const todayCheckins = this.getCheckinsByDate(today)
    
    return {
      wakeUp: todayCheckins.some(c => c.type === 'wakeUp'),
      sleep: todayCheckins.some(c => c.type === 'sleep'),
      custom: todayCheckins.filter(c => !['wakeUp', 'sleep'].includes(c.type))
    }
  }
}