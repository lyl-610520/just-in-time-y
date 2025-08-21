export class SettingsPage {
  constructor() {
    this.container = null
    this.settings = {}
  }

  render() {
    this.container = document.createElement('div')
    this.container.className = 'settings-page'
    this.container.style.cssText = `
      min-height: 100vh;
      padding: 120px 20px 100px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 800px;
      margin: 0 auto;
    `
    
    this.container.innerHTML = `
      <div class="page-header card glass">
        <h1>设置</h1>
        <p>个性化你的应用体验</p>
      </div>
      
      <div class="settings-sections">
        <!-- 显示与语言设置 -->
        <div class="settings-section card glass">
          <h3>显示与语言</h3>
          <div class="setting-item">
            <label>主题</label>
            <select class="input" id="themeSelect">
              <option value="auto">自动</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </div>
          <div class="setting-item">
            <label>语言</label>
            <select class="input" id="languageSelect">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        
        <!-- 个性化设置 -->
        <div class="settings-section card glass">
          <h3>个性化</h3>
          <div class="setting-item">
            <label>宠物名称</label>
            <input type="text" class="input" id="petNameInput" placeholder="输入宠物名称">
          </div>
          <div class="setting-item">
            <label>天气偏好</label>
            <select class="input" id="weatherPreferenceSelect">
              <option value="likeRain">喜欢雨天</option>
              <option value="dislikeRain">讨厌雨天</option>
            </select>
          </div>
        </div>
        
        <!-- 倒计时设置 -->
        <div class="settings-section card glass">
          <h3>倒计时设置</h3>
          <div class="setting-item">
            <label>事件名称</label>
            <input type="text" class="input" id="countdownEventInput" placeholder="输入事件名称">
          </div>
          <div class="setting-item">
            <label>日期</label>
            <input type="date" class="input" id="countdownDateInput">
          </div>
          <button class="btn btn-primary" id="setCountdownBtn">设置倒计时</button>
        </div>
        
        <!-- 智能通知设置 -->
        <div class="settings-section card glass">
          <h3>智能通知</h3>
          <div class="setting-item">
            <label>每日提醒时间</label>
            <input type="time" class="input" id="notificationTimeInput" value="09:00">
          </div>
          <div class="setting-item">
            <button class="btn btn-secondary" id="requestPermissionBtn">申请通知权限</button>
            <span class="permission-status" id="permissionStatus">未申请</span>
          </div>
        </div>
        
        <!-- 音效设置 -->
        <div class="settings-section card glass">
          <h3>音效设置</h3>
          <div class="setting-item">
            <label>音效开关</label>
            <div class="toggle-switch">
              <input type="checkbox" id="soundToggle" checked>
              <span class="toggle-slider"></span>
            </div>
          </div>
          <div class="setting-item">
            <label>音量</label>
            <input type="range" class="input" id="volumeSlider" min="0" max="100" value="70">
          </div>
        </div>
        
        <!-- 数据管理 -->
        <div class="settings-section card glass">
          <h3>数据管理</h3>
          <div class="setting-item">
            <button class="btn btn-danger" id="resetDataBtn">回到最初的时光</button>
            <p class="setting-description">这将清除所有数据，请谨慎操作</p>
          </div>
        </div>
      </div>
    `
    
    this.bindElements()
    this.bindEvents()
    this.init()
    
    return this.container
  }

  bindElements() {
    this.themeSelect = this.container.querySelector('#themeSelect')
    this.languageSelect = this.container.querySelector('#languageSelect')
    this.petNameInput = this.container.querySelector('#petNameInput')
    this.weatherPreferenceSelect = this.container.querySelector('#weatherPreferenceSelect')
    this.countdownEventInput = this.container.querySelector('#countdownEventInput')
    this.countdownDateInput = this.container.querySelector('#countdownDateInput')
    this.setCountdownBtn = this.container.querySelector('#setCountdownBtn')
    this.notificationTimeInput = this.container.querySelector('#notificationTimeInput')
    this.requestPermissionBtn = this.container.querySelector('#requestPermissionBtn')
    this.permissionStatus = this.container.querySelector('#permissionStatus')
    this.soundToggle = this.container.querySelector('#soundToggle')
    this.volumeSlider = this.container.querySelector('#volumeSlider')
    this.resetDataBtn = this.container.querySelector('#resetDataBtn')
  }

  bindEvents() {
    // 主题切换
    this.themeSelect.addEventListener('change', (e) => {
      this.updateTheme(e.target.value)
    })
    
    // 语言切换
    this.languageSelect.addEventListener('change', (e) => {
      this.updateLanguage(e.target.value)
    })
    
    // 宠物名称更新
    this.petNameInput.addEventListener('blur', (e) => {
      this.updatePetName(e.target.value)
    })
    
    // 天气偏好更新
    this.weatherPreferenceSelect.addEventListener('change', (e) => {
      this.updateWeatherPreference(e.target.value)
    })
    
    // 倒计时设置
    this.setCountdownBtn.addEventListener('click', () => {
      this.setCountdown()
    })
    
    // 通知权限申请
    this.requestPermissionBtn.addEventListener('click', () => {
      this.requestNotificationPermission()
    })
    
    // 音效开关
    this.soundToggle.addEventListener('change', (e) => {
      this.updateSoundSettings(e.target.checked)
    })
    
    // 音量调节
    this.volumeSlider.addEventListener('input', (e) => {
      this.updateVolume(e.target.value)
    })
    
    // 数据重置
    this.resetDataBtn.addEventListener('click', () => {
      this.showResetConfirm()
    })
  }

  init() {
    this.loadSettings()
    this.updatePermissionStatus()
  }

  loadSettings() {
    if (window.dataManager) {
      const settings = window.dataManager.getSettings()
      
      // 主题设置
      if (this.themeSelect) {
        this.themeSelect.value = settings.theme || 'auto'
      }
      
      // 语言设置
      if (this.languageSelect) {
        this.languageSelect.value = settings.language || 'zh'
      }
      
      // 宠物名称
      if (this.petNameInput) {
        this.petNameInput.value = settings.petName || '小精灵'
      }
      
      // 天气偏好
      if (this.weatherPreferenceSelect) {
        this.weatherPreferenceSelect.value = settings.weatherPreference || 'likeRain'
      }
      
      // 通知时间
      if (this.notificationTimeInput) {
        this.notificationTimeInput.value = settings.notificationTime || '09:00'
      }
      
      // 音效设置
      if (this.soundToggle) {
        this.soundToggle.checked = settings.soundEnabled !== false
      }
      
      // 音量设置
      if (this.volumeSlider) {
        this.volumeSlider.value = (settings.volume || 0.7) * 100
      }
    }
  }

  updateTheme(theme) {
    if (window.themeManager) {
      window.themeManager.setTheme(theme)
    }
    
    if (window.dataManager) {
      window.dataManager.updateSettings({ theme })
    }
    
    this.showSuccessMessage('主题设置已更新')
  }

  updateLanguage(language) {
    if (window.languageManager) {
      window.languageManager.setLanguage(language)
    }
    
    if (window.dataManager) {
      window.dataManager.updateSettings({ language })
    }
    
    this.showSuccessMessage('语言设置已更新')
  }

  updatePetName(name) {
    if (window.dataManager) {
      window.dataManager.updateSettings({ petName: name })
      window.dataManager.updatePet({ name })
    }
    
    this.showSuccessMessage('宠物名称已更新')
  }

  updateWeatherPreference(preference) {
    if (window.dataManager) {
      window.dataManager.updateSettings({ weatherPreference: preference })
    }
    
    this.showSuccessMessage('天气偏好已更新')
  }

  setCountdown() {
    const event = this.countdownEventInput.value.trim()
    const date = this.countdownDateInput.value
    
    if (!event || !date) {
      this.showErrorMessage('请填写完整信息')
      return
    }
    
    const countdown = {
      event,
      date: new Date(date).toISOString()
    }
    
    if (window.dataManager) {
      window.dataManager.setCountdown(countdown)
    }
    
    this.showSuccessMessage('倒计时设置成功！')
    
    // 清空输入
    this.countdownEventInput.value = ''
    this.countdownDateInput.value = ''
  }

  async requestNotificationPermission() {
    if (window.notificationManager) {
      const granted = await window.notificationManager.requestPermission()
      
      if (granted) {
        this.showSuccessMessage('通知权限已获得')
        this.updatePermissionStatus()
      } else {
        this.showErrorMessage('通知权限被拒绝')
        this.updatePermissionStatus()
      }
    }
  }

  updatePermissionStatus() {
    if (window.notificationManager) {
      const status = window.notificationManager.getPermissionStatus()
      const statusText = {
        'granted': '已获得',
        'denied': '被拒绝',
        'default': '未申请',
        'unsupported': '不支持'
      }
      
      if (this.permissionStatus) {
        this.permissionStatus.textContent = statusText[status] || status
        this.permissionStatus.className = `permission-status ${status}`
      }
    }
  }

  updateSoundSettings(enabled) {
    if (window.audioManager) {
      window.audioManager.setEnabled(enabled)
    }
    
    if (window.dataManager) {
      window.dataManager.updateSettings({ soundEnabled: enabled })
    }
    
    this.showSuccessMessage(`音效已${enabled ? '开启' : '关闭'}`)
  }

  updateVolume(volume) {
    const volumeValue = volume / 100
    
    if (window.audioManager) {
      window.audioManager.setVolume(volumeValue)
    }
    
    if (window.dataManager) {
      window.dataManager.updateSettings({ volume: volumeValue })
    }
  }

  showResetConfirm() {
    const modal = document.createElement('div')
    modal.className = 'modal show'
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>确认重置数据</h3>
        </div>
        <div class="modal-body">
          <p>这样做会清除所有数据，包括：</p>
          <ul>
            <li>所有打卡记录</li>
            <li>成就和配饰</li>
            <li>设置和偏好</li>
            <li>音乐播放列表</li>
          </ul>
          <p><strong>此操作不可撤销，确定要继续吗？</strong></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelBtn">我再想想</button>
          <button class="btn btn-danger" id="confirmBtn">我明白</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // 绑定事件
    modal.querySelector('#cancelBtn').addEventListener('click', () => {
      modal.remove()
    })
    
    modal.querySelector('#confirmBtn').addEventListener('click', () => {
      this.resetAllData()
      modal.remove()
    })
  }

  resetAllData() {
    if (window.dataManager) {
      window.dataManager.resetAllData()
    }
    
    // 显示重置成功消息
    this.showResetSuccess()
    
    // 重新加载设置
    setTimeout(() => {
      this.loadSettings()
    }, 1000)
  }

  showResetSuccess() {
    const modal = document.createElement('div')
    modal.className = 'modal show'
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>重置完成</h3>
        </div>
        <div class="modal-body">
          <p>你即将涅槃重生，恭喜进入下一阶段！</p>
          <p>所有数据已清除，应用将重新开始。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" id="okBtn">好的</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    modal.querySelector('#okBtn').addEventListener('click', () => {
      modal.remove()
    })
  }

  showSuccessMessage(message) {
    const toast = document.createElement('div')
    toast.className = 'success-toast glass'
    toast.innerHTML = `
      <span class="toast-icon">✅</span>
      <span class="toast-text">${message}</span>
    `
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(40, 167, 69, 0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 25px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 2000;
      animation: slideUp 0.3s ease-out;
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease-out'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 2000)
  }

  showErrorMessage(message) {
    const toast = document.createElement('div')
    toast.className = 'error-toast glass'
    toast.innerHTML = `
      <span class="toast-icon">❌</span>
      <span class="toast-text">${message}</span>
    `
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(220, 53, 69, 0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 25px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 2000;
      animation: slideUp 0.3s ease-out;
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease-out'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 3000)
  }

  destroy() {
    // 清理资源
  }
}