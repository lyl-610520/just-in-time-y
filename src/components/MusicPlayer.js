export class MusicPlayer {
  constructor() {
    this.audio = null
    this.currentTrack = 0
    this.playlist = []
    this.isPlaying = false
    this.volume = 0.7
    this.isShuffled = false
    this.isLooped = false
    
    this.container = null
    this.playButton = null
    this.nextButton = null
    this.volumeSlider = null
    this.progressBar = null
    this.currentTimeDisplay = null
    this.durationDisplay = null
    this.trackInfo = null
    this.volumeIcon = null
    
    this.eventListeners = {}
  }

  init() {
    this.createPlayer()
    this.bindEvents()
    this.loadPlaylist()
    this.updateDisplay()
  }

  createPlayer() {
    this.container = document.createElement('div')
    this.container.className = 'music-player glass'
    this.container.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      height: 60px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 15px;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    `
    
    // 播放/暂停按钮
    this.playButton = document.createElement('button')
    this.playButton.className = 'music-control-btn'
    this.playButton.innerHTML = this.getPlayIcon()
    this.playButton.style.cssText = `
      width: 40px;
      height: 40px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
      font-size: 18px;
    `
    
    // 下一首按钮
    this.nextButton = document.createElement('button')
    this.nextButton.className = 'music-control-btn'
    this.nextButton.innerHTML = '⏭️'
    this.nextButton.style.cssText = `
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    `
    
    // 音量控制
    this.volumeIcon = document.createElement('div')
    this.volumeIcon.innerHTML = '🔊'
    this.volumeIcon.style.cssText = `
      font-size: 16px;
      cursor: pointer;
      user-select: none;
    `
    
    this.volumeSlider = document.createElement('input')
    this.volumeSlider.type = 'range'
    this.volumeSlider.min = '0'
    this.volumeSlider.max = '100'
    this.volumeSlider.value = '70'
    this.volumeSlider.className = 'volume-slider'
    this.volumeSlider.style.cssText = `
      width: 60px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    `
    
    // 进度条
    this.progressBar = document.createElement('div')
    this.progressBar.className = 'progress-bar'
    this.progressBar.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 0 0 30px 30px;
      overflow: hidden;
    `
    
    this.progressBar.innerHTML = `
      <div class="progress-fill" style="
        height: 100%;
        background: linear-gradient(90deg, #4dabf7, #74c0fc);
        width: 0%;
        transition: width 0.1s ease;
      "></div>
    `
    
    // 添加按钮悬停效果
    this.addHoverEffects()
    
    // 组装播放器
    this.container.appendChild(this.playButton)
    this.container.appendChild(this.nextButton)
    this.container.appendChild(this.volumeIcon)
    this.container.appendChild(this.volumeSlider)
    this.container.appendChild(this.progressBar)
    
    document.body.appendChild(this.container)
  }

  addHoverEffects() {
    // 播放按钮悬停效果
    this.playButton.addEventListener('mouseenter', () => {
      this.playButton.style.background = 'rgba(255, 255, 255, 0.3)'
      this.playButton.style.transform = 'scale(1.1)'
    })
    
    this.playButton.addEventListener('mouseleave', () => {
      this.playButton.style.background = 'rgba(255, 255, 255, 0.2)'
      this.playButton.style.transform = 'scale(1)'
    })
    
    // 下一首按钮悬停效果
    this.nextButton.addEventListener('mouseenter', () => {
      this.nextButton.style.background = 'rgba(255, 255, 255, 0.25)'
      this.nextButton.style.transform = 'scale(1.1)'
    })
    
    this.nextButton.addEventListener('mouseleave', () => {
      this.nextButton.style.background = 'rgba(255, 255, 255, 0.15)'
      this.nextButton.style.transform = 'scale(1)'
    })
  }

  bindEvents() {
    // 播放/暂停按钮事件
    this.playButton.addEventListener('click', () => {
      this.togglePlay()
    })
    
    // 下一首按钮事件
    this.nextButton.addEventListener('click', () => {
      this.nextTrack()
    })
    
    // 音量控制事件
    this.volumeSlider.addEventListener('input', (e) => {
      this.setVolume(e.target.value / 100)
    })
    
    // 音量图标点击事件
    this.volumeIcon.addEventListener('click', () => {
      this.toggleMute()
    })
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        this.togglePlay()
      } else if (e.code === 'ArrowRight' && e.target === document.body) {
        e.preventDefault()
        this.nextTrack()
      }
    })
  }

  loadPlaylist() {
    // 从localStorage加载播放列表
    const savedPlaylist = localStorage.getItem('musicPlaylist')
    if (savedPlaylist) {
      this.playlist = JSON.parse(savedPlaylist)
    } else {
      // 默认播放列表
      this.playlist = [
        { id: 'track1', name: '曲目一', src: '/src/assets/audio/track1.mp3', type: 'builtin' },
        { id: 'track2', name: '曲目二', src: '/src/assets/audio/track2.mp3', type: 'builtin' },
        { id: 'track3', name: '曲目三', src: '/src/assets/audio/track3.mp3', type: 'builtin' }
      ]
      this.savePlaylist()
    }
    
    // 加载当前播放位置
    const savedCurrentTrack = localStorage.getItem('musicCurrentTrack')
    if (savedCurrentTrack !== null) {
      this.currentTrack = parseInt(savedCurrentTrack)
    }
    
    // 加载音量设置
    const savedVolume = localStorage.getItem('musicVolume')
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume)
      this.volumeSlider.value = this.volume * 100
    }
    
    // 创建音频对象
    if (this.playlist.length > 0) {
      this.createAudio()
    }
  }

  createAudio() {
    if (this.audio) {
      this.audio.pause()
      this.audio.remove()
    }
    
    this.audio = new Audio()
    this.audio.preload = 'auto'
    this.audio.volume = this.volume
    
    // 音频事件监听
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDisplay()
    })
    
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress()
    })
    
    this.audio.addEventListener('ended', () => {
      this.nextTrack()
    })
    
    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      this.nextTrack()
    })
    
    // 加载当前曲目
    this.loadTrack(this.currentTrack)
  }

  loadTrack(index) {
    if (this.playlist.length === 0) return
    
    if (index >= this.playlist.length) {
      index = 0
    } else if (index < 0) {
      index = this.playlist.length - 1
    }
    
    this.currentTrack = index
    const track = this.playlist[index]
    
    if (this.audio) {
      this.audio.src = track.src
      this.audio.load()
    }
    
    // 保存当前播放位置
    localStorage.setItem('musicCurrentTrack', this.currentTrack.toString())
    
    this.updateDisplay()
  }

  togglePlay() {
    if (!this.audio || this.playlist.length === 0) return
    
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  play() {
    if (!this.audio) return
    
    this.audio.play().then(() => {
      this.isPlaying = true
      this.playButton.innerHTML = this.getPauseIcon()
      this.updateDisplay()
    }).catch(error => {
      console.error('Failed to play audio:', error)
    })
  }

  pause() {
    if (!this.audio) return
    
    this.audio.pause()
    this.isPlaying = false
    this.playButton.innerHTML = this.getPlayIcon()
    this.updateDisplay()
  }

  nextTrack() {
    if (this.playlist.length === 0) return
    
    let nextIndex = this.currentTrack + 1
    if (nextIndex >= this.playlist.length) {
      nextIndex = 0
    }
    
    this.loadTrack(nextIndex)
    
    if (this.isPlaying) {
      this.play()
    }
  }

  previousTrack() {
    if (this.playlist.length === 0) return
    
    let prevIndex = this.currentTrack - 1
    if (prevIndex < 0) {
      prevIndex = this.playlist.length - 1
    }
    
    this.loadTrack(prevIndex)
    
    if (this.isPlaying) {
      this.play()
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    
    if (this.audio) {
      this.audio.volume = this.volume
    }
    
    // 更新音量图标
    this.updateVolumeIcon()
    
    // 保存音量设置
    localStorage.setItem('musicVolume', this.volume.toString())
  }

  toggleMute() {
    if (this.volume > 0) {
      this.lastVolume = this.volume
      this.setVolume(0)
    } else {
      this.setVolume(this.lastVolume || 0.7)
    }
  }

  updateVolumeIcon() {
    if (this.volume === 0) {
      this.volumeIcon.innerHTML = '🔇'
    } else if (this.volume < 0.5) {
      this.volumeIcon.innerHTML = '🔉'
    } else {
      this.volumeIcon.innerHTML = '🔊'
    }
  }

  updateProgress() {
    if (!this.audio) return
    
    const progress = (this.audio.currentTime / this.audio.duration) * 100
    const progressFill = this.progressBar.querySelector('.progress-fill')
    if (progressFill) {
      progressFill.style.width = `${progress}%`
    }
  }

  updateDisplay() {
    if (this.playlist.length === 0) return
    
    const track = this.playlist[this.currentTrack]
    if (!track) return
    
    // 更新播放按钮图标
    if (this.isPlaying) {
      this.playButton.innerHTML = this.getPauseIcon()
    } else {
      this.playButton.innerHTML = this.getPlayIcon()
    }
    
    // 更新音量图标
    this.updateVolumeIcon()
  }

  getPlayIcon() {
    return '▶️'
  }

  getPauseIcon() {
    return '⏸️'
  }

  // 添加音乐文件
  addTrack(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const track = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          src: e.target.result,
          type: 'custom',
          timestamp: new Date().toISOString()
        }
        
        this.playlist.push(track)
        this.savePlaylist()
        
        // 如果是第一首添加的曲目，自动播放
        if (this.playlist.length === 1) {
          this.createAudio()
        }
        
        resolve(track)
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  // 移除音乐文件
  removeTrack(trackId) {
    const index = this.playlist.findIndex(track => track.id === trackId)
    if (index === -1) return false
    
    // 如果移除的是当前播放的曲目，切换到下一首
    if (index === this.currentTrack) {
      this.nextTrack()
    } else if (index < this.currentTrack) {
      this.currentTrack--
    }
    
    this.playlist.splice(index, 1)
    this.savePlaylist()
    
    // 如果没有曲目了，清理音频对象
    if (this.playlist.length === 0) {
      if (this.audio) {
        this.audio.pause()
        this.audio.remove()
        this.audio = null
      }
      this.isPlaying = false
    }
    
    this.updateDisplay()
    return true
  }

  // 保存播放列表
  savePlaylist() {
    localStorage.setItem('musicPlaylist', JSON.stringify(this.playlist))
  }

  // 获取当前播放信息
  getCurrentTrackInfo() {
    if (this.playlist.length === 0) return null
    
    const track = this.playlist[this.currentTrack]
    return {
      ...track,
      isPlaying: this.isPlaying,
      currentTime: this.audio ? this.audio.currentTime : 0,
      duration: this.audio ? this.audio.duration : 0,
      volume: this.volume
    }
  }

  // 设置播放模式
  setPlayMode(mode) {
    switch (mode) {
      case 'loop':
        this.isLooped = true
        this.isShuffled = false
        break
      case 'shuffle':
        this.isShuffled = true
        this.isLooped = false
        break
      default:
        this.isLooped = false
        this.isShuffled = false
    }
  }

  // 销毁组件
  destroy() {
    if (this.audio) {
      this.audio.pause()
      this.audio.remove()
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    
    // 清理事件监听器
    this.eventListeners = {}
  }
}