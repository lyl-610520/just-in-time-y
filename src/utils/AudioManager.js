export class AudioManager {
  constructor() {
    this.sounds = {}
    this.isEnabled = true
    this.volume = 0.7
    this.eventListeners = {}
    
    // 预加载音效
    this.soundFiles = {
      checkin: '/src/assets/audio/checkin.mp3',
      achievement: '/src/assets/audio/achievement.mp3',
      alarm: '/src/assets/audio/alarm.mp3',
      notification: '/src/assets/audio/notification.mp3',
      button: '/src/assets/audio/button.mp3',
      success: '/src/assets/audio/success.mp3'
    }
  }

  async init() {
    try {
      // 从localStorage获取音效设置
      const soundEnabled = localStorage.getItem('soundEnabled')
      if (soundEnabled !== null) {
        this.isEnabled = soundEnabled === 'true'
      }
      
      const volume = localStorage.getItem('soundVolume')
      if (volume !== null) {
        this.volume = parseFloat(volume)
      }
      
      // 预加载音效
      await this.preloadSounds()
      
      console.log('AudioManager initialized successfully')
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error)
    }
  }

  async preloadSounds() {
    const loadPromises = Object.entries(this.soundFiles).map(async ([key, src]) => {
      try {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.volume = this.volume
        
        // 设置音频属性
        audio.crossOrigin = 'anonymous'
        
        // 加载音频
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true })
          audio.addEventListener('error', reject, { once: true })
          audio.src = src
        })
        
        this.sounds[key] = audio
        console.log(`Sound loaded: ${key}`)
      } catch (error) {
        console.warn(`Failed to load sound: ${key}`, error)
        // 创建静音音频作为备用
        this.sounds[key] = this.createSilentAudio()
      }
    })
    
    await Promise.allSettled(loadPromises)
  }

  createSilentAudio() {
    // 创建一个静音的音频对象作为备用
    const audio = new Audio()
    audio.volume = 0
    return audio
  }

  // 播放音效
  playSound(soundName, options = {}) {
    if (!this.isEnabled) return
    
    const audio = this.sounds[soundName]
    if (!audio) {
      console.warn(`Sound not found: ${soundName}`)
      return
    }
    
    try {
      // 克隆音频对象以支持同时播放
      const audioClone = audio.cloneNode()
      audioClone.volume = options.volume !== undefined ? options.volume : this.volume
      
      // 设置播放选项
      if (options.loop) {
        audioClone.loop = true
      }
      
      if (options.playbackRate) {
        audioClone.playbackRate = options.playbackRate
      }
      
      // 播放音频
      const playPromise = audioClone.play()
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error(`Failed to play sound: ${soundName}`, error)
        })
      }
      
      // 如果不是循环播放，播放完成后清理
      if (!options.loop) {
        audioClone.addEventListener('ended', () => {
          audioClone.remove()
        }, { once: true })
      }
      
      return audioClone
    } catch (error) {
      console.error(`Error playing sound: ${soundName}`, error)
    }
  }

  // 播放打卡音效
  playCheckinSound() {
    return this.playSound('checkin', { volume: 0.6 })
  }

  // 播放成就音效
  playAchievementSound() {
    return this.playSound('achievement', { volume: 0.8 })
  }

  // 播放闹钟音效
  playAlarmSound() {
    return this.playSound('alarm', { 
      volume: 0.9, 
      loop: true,
      playbackRate: 1.0
    })
  }

  // 播放通知音效
  playNotificationSound() {
    return this.playSound('notification', { volume: 0.5 })
  }

  // 播放按钮音效
  playButtonSound() {
    return this.playSound('button', { volume: 0.4 })
  }

  // 播放成功音效
  playSuccessSound() {
    return this.playSound('success', { volume: 0.7 })
  }

  // 停止特定音效
  stopSound(soundName) {
    const audio = this.sounds[soundName]
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  // 停止所有音效
  stopAllSounds() {
    Object.values(this.sounds).forEach(audio => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })
  }

  // 设置音效开关
  setEnabled(enabled) {
    this.isEnabled = enabled
    localStorage.setItem('soundEnabled', enabled.toString())
    
    // 触发设置变化事件
    this.emit('soundEnabledChange', enabled)
    
    // 如果关闭音效，停止所有正在播放的声音
    if (!enabled) {
      this.stopAllSounds()
    }
  }

  // 设置音量
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('soundVolume', this.volume.toString())
    
    // 更新所有已加载音频的音量
    Object.values(this.sounds).forEach(audio => {
      if (audio) {
        audio.volume = this.volume
      }
    })
    
    // 触发音量变化事件
    this.emit('volumeChange', this.volume)
  }

  // 获取音效状态
  isSoundEnabled() {
    return this.isEnabled
  }

  // 获取音量
  getVolume() {
    return this.volume
  }

  // 淡入音效
  fadeIn(soundName, duration = 1000) {
    if (!this.isEnabled) return
    
    const audio = this.sounds[soundName]
    if (!audio) return
    
    audio.volume = 0
    audio.play()
    
    const startTime = Date.now()
    const startVolume = 0
    const targetVolume = this.volume
    
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      audio.volume = startVolume + (targetVolume - startVolume) * progress
      
      if (progress >= 1) {
        clearInterval(fadeInterval)
      }
    }, 16) // 60fps
  }

  // 淡出音效
  fadeOut(soundName, duration = 1000) {
    const audio = this.sounds[soundName]
    if (!audio) return
    
    const startTime = Date.now()
    const startVolume = audio.volume
    const targetVolume = 0
    
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      audio.volume = startVolume + (targetVolume - startVolume) * progress
      
      if (progress >= 1) {
        clearInterval(fadeInterval)
        audio.pause()
        audio.currentTime = 0
      }
    }, 16) // 60fps
  }

  // 播放音效序列
  async playSoundSequence(soundNames, interval = 200) {
    if (!this.isEnabled) return
    
    for (let i = 0; i < soundNames.length; i++) {
      this.playSound(soundNames[i])
      
      if (i < soundNames.length - 1) {
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
  }

  // 创建自定义音频
  createCustomAudio(src, options = {}) {
    const audio = new Audio(src)
    audio.volume = options.volume !== undefined ? options.volume : this.volume
    audio.preload = 'auto'
    
    if (options.loop) {
      audio.loop = true
    }
    
    return audio
  }

  // 播放自定义音频
  async playCustomAudio(src, options = {}) {
    if (!this.isEnabled) return null
    
    try {
      const audio = this.createCustomAudio(src, options)
      
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        await playPromise
      }
      
      return audio
    } catch (error) {
      console.error('Failed to play custom audio:', error)
      return null
    }
  }

  // 预加载自定义音频
  async preloadCustomAudio(src) {
    try {
      const audio = new Audio()
      audio.preload = 'auto'
      
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true })
        audio.addEventListener('error', reject, { once: true })
        audio.src = src
      })
      
      return audio
    } catch (error) {
      console.error('Failed to preload custom audio:', error)
      return null
    }
  }

  // 获取支持的音频格式
  getSupportedFormats() {
    const audio = new Audio()
    const formats = ['mp3', 'wav', 'ogg', 'aac', 'm4a']
    const supported = []
    
    formats.forEach(format => {
      if (audio.canPlayType(`audio/${format}`)) {
        supported.push(format)
      }
    })
    
    return supported
  }

  // 检查音频是否正在播放
  isPlaying(soundName) {
    const audio = this.sounds[soundName]
    return audio ? !audio.paused : false
  }

  // 获取音频时长
  getDuration(soundName) {
    const audio = this.sounds[soundName]
    return audio ? audio.duration : 0
  }

  // 获取当前播放时间
  getCurrentTime(soundName) {
    const audio = this.sounds[soundName]
    return audio ? audio.currentTime : 0
  }

  // 设置播放时间
  setCurrentTime(soundName, time) {
    const audio = this.sounds[soundName]
    if (audio && !isNaN(time)) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration))
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
    // 停止所有音频
    this.stopAllSounds()
    
    // 清理事件监听器
    this.eventListeners = {}
    
    // 清理音频对象
    this.sounds = {}
  }
}