export class HomePage {
  constructor() {
    this.container = null
    this.clockElement = null
    this.greetingElement = null
    this.weatherElement = null
    this.checkinButtons = {}
    this.customCheckinForm = null
    this.checkinList = null
    this.alarmButton = null
    this.countdownCard = null
    this.gamePanel = null
    
    this.currentTime = new Date()
    this.clockInterval = null
    this.checkinStatus = {
      wakeUp: false,
      sleep: false
    }
  }

  render() {
    this.container = document.createElement('div')
    this.container.className = 'home-page'
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
      <!-- 时钟和问候语 -->
      <div class="clock-section card glass">
        <div class="clock-display" id="clockDisplay"></div>
        <div class="greeting-text" id="greetingText"></div>
        <div class="weather-info" id="weatherInfo"></div>
      </div>
      
      <!-- 闹钟按钮 -->
      <div class="alarm-section">
        <button class="alarm-btn glass" id="alarmBtn">
          <span class="alarm-icon">⏰</span>
        </button>
      </div>
      
      <!-- 快捷打卡 -->
      <div class="quick-checkin card glass">
        <h3>快捷打卡</h3>
        <div class="checkin-buttons">
          <button class="btn btn-primary checkin-btn" id="wakeUpBtn">
            <span class="btn-icon">🌅</span>
            <span class="btn-text">我起床啦</span>
          </button>
          <button class="btn btn-primary checkin-btn" id="sleepBtn">
            <span class="btn-icon">🌙</span>
            <span class="btn-text">我要睡了</span>
          </button>
        </div>
      </div>
      
      <!-- 自定义打卡 -->
      <div class="custom-checkin card glass">
        <h3>自定义打卡</h3>
        <form class="checkin-form" id="checkinForm">
          <div class="form-row">
            <input type="text" class="input" id="checkinInput" placeholder="输入打卡内容...">
            <select class="input" id="categorySelect">
              <option value="life">生活</option>
              <option value="study">学习</option>
              <option value="work">工作</option>
            </select>
          </div>
          <button type="submit" class="btn btn-secondary">添加</button>
        </form>
        <div class="checkin-list" id="checkinList"></div>
      </div>
      
      <!-- 游戏化面板 -->
      <div class="game-panel card glass">
        <h3>我的伙伴</h3>
        <div class="game-content">
          <div class="pet-section">
            <div class="pet-avatar" id="petAvatar">🐱</div>
            <div class="pet-info">
              <div class="pet-name" id="petName">小精灵</div>
              <div class="pet-accessory" id="petAccessory">春天配饰</div>
            </div>
          </div>
          <div class="flower-section">
            <div class="flower-avatar" id="flowerAvatar">🌱</div>
            <div class="flower-info">
              <div class="flower-name" id="flowerName">种子</div>
              <div class="flower-level" id="flowerLevel">Lv.1</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 倒计时卡片 -->
      <div class="countdown-card card glass" id="countdownCard" style="display: none;">
        <h3>倒计时</h3>
        <div class="countdown-content">
          <div class="countdown-event" id="countdownEvent">重要事件</div>
          <div class="countdown-time" id="countdownTime">00:00:00</div>
        </div>
      </div>
    `
    
    this.bindElements()
    this.bindEvents()
    this.init()
    
    return this.container
  }

  bindElements() {
    this.clockElement = this.container.querySelector('#clockDisplay')
    this.greetingElement = this.container.querySelector('#greetingText')
    this.weatherElement = this.container.querySelector('#weatherInfo')
    this.alarmButton = this.container.querySelector('#alarmBtn')
    this.checkinButtons = {
      wakeUp: this.container.querySelector('#wakeUpBtn'),
      sleep: this.container.querySelector('#sleepBtn')
    }
    this.customCheckinForm = this.container.querySelector('#checkinForm')
    this.checkinInput = this.container.querySelector('#checkinInput')
    this.categorySelect = this.container.querySelector('#categorySelect')
    this.checkinList = this.container.querySelector('#checkinList')
    this.countdownCard = this.container.querySelector('#countdownCard')
    this.gamePanel = this.container.querySelector('.game-panel')
    
    // 游戏化元素
    this.petAvatar = this.container.querySelector('#petAvatar')
    this.petName = this.container.querySelector('#petName')
    this.petAccessory = this.container.querySelector('#petAccessory')
    this.flowerAvatar = this.container.querySelector('#flowerAvatar')
    this.flowerName = this.container.querySelector('#flowerName')
    this.flowerLevel = this.container.querySelector('#flowerLevel')
  }

  bindEvents() {
    // 闹钟按钮事件
    this.alarmButton.addEventListener('click', () => {
      this.showAlarmModal()
    })
    
    // 打卡按钮事件
    this.checkinButtons.wakeUp.addEventListener('click', () => {
      this.handleCheckin('wakeUp')
    })
    
    this.checkinButtons.sleep.addEventListener('click', () => {
      this.handleCheckin('sleep')
    })
    
    // 自定义打卡表单事件
    this.customCheckinForm.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleCustomCheckin()
    })
  }

  init() {
    this.startClock()
    this.updateGreeting()
    this.updateWeather()
    this.updateCheckinStatus()
    this.updateGamePanel()
    this.updateCountdown()
    this.loadTodayCheckins()
  }

  startClock() {
    this.updateClock()
    this.clockInterval = setInterval(() => {
      this.updateClock()
    }, 1000)
  }

  updateClock() {
    this.currentTime = new Date()
    const timeString = this.currentTime.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    if (this.clockElement) {
      this.clockElement.innerHTML = `
        <div class="clock-time">${timeString}</div>
        <div class="clock-date">${this.currentTime.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })}</div>
      `
    }
  }

  updateGreeting() {
    const hour = this.currentTime.getHours()
    let greeting = ''
    
    if (hour >= 6 && hour < 10) {
      greeting = '早上好！新的一天开始了 🌅'
    } else if (hour >= 10 && hour < 14) {
      greeting = '中午好！记得吃午饭哦 🍽️'
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好！继续加油 💪'
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好！今天过得怎么样？ 🌆'
    } else {
      greeting = '夜深了，该休息了 🌙'
    }
    
    if (this.greetingElement) {
      this.greetingElement.textContent = greeting
    }
  }

  updateWeather() {
    // 这里应该从WeatherManager获取天气信息
    // 暂时使用模拟数据
    const weather = {
      condition: '晴天',
      temperature: 22
    }
    
    if (this.weatherElement) {
      this.weatherElement.innerHTML = `
        <div class="weather-display">
          <span class="weather-icon">☀️</span>
          <span class="weather-text">当前天气：${weather.condition}，${weather.temperature}°C</span>
        </div>
        <div class="weather-comfort">阳光明媚，心情也会变好呢</div>
      `
    }
  }

  updateCheckinStatus() {
    // 从DataManager获取今日打卡状态
    // 暂时使用模拟数据
    const todayCheckins = this.getTodayCheckins()
    
    this.checkinStatus.wakeUp = todayCheckins.some(c => c.type === 'wakeUp')
    this.checkinStatus.sleep = todayCheckins.some(c => c.type === 'sleep')
    
    // 更新按钮状态
    Object.keys(this.checkinButtons).forEach(type => {
      const button = this.checkinButtons[type]
      if (this.checkinStatus[type]) {
        button.disabled = true
        button.classList.add('disabled')
        button.innerHTML = `
          <span class="btn-icon">✅</span>
          <span class="btn-text">已完成</span>
        `
      } else {
        button.disabled = false
        button.classList.remove('disabled')
        button.innerHTML = `
          <span class="btn-icon">${type === 'wakeUp' ? '🌅' : '🌙'}</span>
          <span class="btn-text">${type === 'wakeUp' ? '我起床啦' : '我要睡了'}</span>
        `
      }
    })
  }

  handleCheckin(type) {
    if (this.checkinStatus[type]) return
    
    // 播放音效
    if (window.audioManager) {
      window.audioManager.playCheckinSound()
    }
    
    // 显示成功消息
    this.showCheckinSuccess(type)
    
    // 更新状态
    this.checkinStatus[type] = true
    this.updateCheckinStatus()
    
    // 更新游戏面板
    this.updateGamePanel()
    
    // 保存到DataManager
    if (window.dataManager) {
      window.dataManager.addCheckin({
        type: type,
        content: type === 'wakeUp' ? '起床打卡' : '睡觉打卡',
        category: 'life'
      })
    }
  }

  showCheckinSuccess(type) {
    const message = type === 'wakeUp' ? '早起的人儿最棒了！' : '早睡早起身体好，晚安！'
    const icon = type === 'wakeUp' ? '🌅' : '🌙'
    
    // 创建成功提示
    const successToast = document.createElement('div')
    successToast.className = 'success-toast glass'
    successToast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `
    successToast.style.cssText = `
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
    
    document.body.appendChild(successToast)
    
    // 3秒后自动移除
    setTimeout(() => {
      successToast.style.animation = 'slideDown 0.3s ease-out'
      setTimeout(() => {
        if (successToast.parentNode) {
          successToast.parentNode.removeChild(successToast)
        }
      }, 300)
    }, 3000)
  }

  handleCustomCheckin() {
    const content = this.checkinInput.value.trim()
    const category = this.categorySelect.value
    
    if (!content) return
    
    // 检查是否重复打卡
    const todayCheckins = this.getTodayCheckins()
    const duplicateCheckin = todayCheckins.find(c => 
      c.content === content && c.category === category
    )
    
    if (duplicateCheckin) {
      this.showDuplicateConfirm(content, category)
    } else {
      this.addCustomCheckin(content, category)
    }
    
    this.checkinInput.value = ''
  }

  showDuplicateConfirm(content, category) {
    const modal = document.createElement('div')
    modal.className = 'modal show'
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>确认重复打卡？</h3>
        </div>
        <div class="modal-body">
          <p>你已经打卡过"${content}"了，确定要重复吗？</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelBtn">我再想想</button>
          <button class="btn btn-primary" id="confirmBtn">我明白</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // 绑定事件
    modal.querySelector('#cancelBtn').addEventListener('click', () => {
      modal.remove()
    })
    
    modal.querySelector('#confirmBtn').addEventListener('click', () => {
      this.addCustomCheckin(content, category)
      modal.remove()
    })
  }

  addCustomCheckin(content, category) {
    // 播放音效
    if (window.audioManager) {
      window.audioManager.playCheckinSound()
    }
    
    // 保存到DataManager
    if (window.dataManager) {
      window.dataManager.addCheckin({
        type: 'custom',
        content: content,
        category: category
      })
    }
    
    // 更新列表
    this.loadTodayCheckins()
    
    // 更新游戏面板
    this.updateGamePanel()
    
    // 显示成功提示
    this.showCustomCheckinSuccess(content)
  }

  showCustomCheckinSuccess(content) {
    const successToast = document.createElement('div')
    successToast.className = 'success-toast glass'
    successToast.innerHTML = `
      <span class="toast-icon">✅</span>
      <span class="toast-text">打卡成功：${content}</span>
    `
    successToast.style.cssText = `
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
    
    document.body.appendChild(successToast)
    
    setTimeout(() => {
      successToast.style.animation = 'slideDown 0.3s ease-out'
      setTimeout(() => {
        if (successToast.parentNode) {
          successToast.parentNode.removeChild(successToast)
        }
      }, 300)
    }, 2000)
  }

  loadTodayCheckins() {
    // 从DataManager获取今日打卡记录
    const todayCheckins = this.getTodayCheckins()
    
    if (this.checkinList) {
      if (todayCheckins.length === 0) {
        this.checkinList.innerHTML = '<p class="no-checkins">今天还没有打卡记录</p>'
      } else {
        this.checkinList.innerHTML = todayCheckins.map(checkin => `
          <div class="checkin-item">
            <div class="checkin-content">${checkin.content}</div>
            <div class="checkin-meta">
              <span class="checkin-category">${this.getCategoryName(checkin.category)}</span>
              <span class="checkin-time">${this.formatTime(checkin.timestamp)}</span>
            </div>
          </div>
        `).join('')
      }
    }
  }

  getCategoryName(category) {
    const names = {
      life: '生活',
      study: '学习',
      work: '工作'
    }
    return names[category] || category
  }

  formatTime(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  updateGamePanel() {
    // 从DataManager获取宠物和花朵信息
    // 暂时使用模拟数据
    const pet = {
      name: '小精灵',
      accessory: '春天配饰'
    }
    
    const flower = {
      name: '种子',
      level: 1
    }
    
    if (this.petName) this.petName.textContent = pet.name
    if (this.petAccessory) this.petAccessory.textContent = pet.accessory
    if (this.flowerName) this.flowerName.textContent = flower.name
    if (this.flowerLevel) this.flowerLevel.textContent = `Lv.${flower.level}`
  }

  updateCountdown() {
    // 从DataManager获取倒计时信息
    // 暂时隐藏倒计时卡片
    if (this.countdownCard) {
      this.countdownCard.style.display = 'none'
    }
  }

  showAlarmModal() {
    const modal = document.createElement('div')
    modal.className = 'modal show'
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>设置闹钟</h3>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>时间</label>
            <input type="time" class="input" id="alarmTime" value="08:00">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelBtn">取消</button>
          <button class="btn btn-primary" id="setBtn">设置</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // 绑定事件
    modal.querySelector('#cancelBtn').addEventListener('click', () => {
      modal.remove()
    })
    
    modal.querySelector('#setBtn').addEventListener('click', () => {
      const time = modal.querySelector('#alarmTime').value
      this.setAlarm(time)
      modal.remove()
    })
  }

  setAlarm(time) {
    // 保存到DataManager
    if (window.dataManager) {
      window.dataManager.addAlarm(time)
    }
    
    // 显示成功提示
    this.showAlarmSetSuccess(time)
  }

  showAlarmSetSuccess(time) {
    const successToast = document.createElement('div')
    successToast.className = 'success-toast glass'
    successToast.innerHTML = `
      <span class="toast-icon">⏰</span>
      <span class="toast-text">闹钟已设置为 ${time}</span>
    `
    successToast.style.cssText = `
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
    
    document.body.appendChild(successToast)
    
    setTimeout(() => {
      successToast.style.animation = 'slideDown 0.3s ease-out'
      setTimeout(() => {
        if (successToast.parentNode) {
          successToast.parentNode.removeChild(successToast)
        }
      }, 300)
    }, 2000)
  }

  getTodayCheckins() {
    // 从DataManager获取今日打卡记录
    // 暂时返回模拟数据
    return []
  }

  destroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval)
    }
  }
}