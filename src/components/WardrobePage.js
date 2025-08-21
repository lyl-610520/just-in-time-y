export class WardrobePage {
  constructor() {
    this.container = null
    this.currentTab = 'pet'
  }

  render() {
    this.container = document.createElement('div')
    this.container.className = 'wardrobe-page'
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
        <h1>衣柜与商店</h1>
        <p>为你的宠物伙伴装扮，解锁更多成就</p>
      </div>
      
      <div class="tab-navigation glass">
        <button class="tab-btn active" data-tab="pet">🐱 宠物</button>
        <button class="tab-btn" data-tab="achievements">🏆 成就</button>
        <button class="tab-btn" data-tab="themes">🎨 主题</button>
      </div>
      
      <div class="tab-content">
        <!-- 宠物配饰标签页 -->
        <div class="tab-panel active" id="pet-panel">
          <div class="pet-display card glass">
            <div class="pet-preview">
              <div class="pet-avatar" id="petAvatar">🐱</div>
              <div class="pet-info">
                <h3 id="petName">小精灵</h3>
                <p id="petAccessory">当前配饰：春天配饰</p>
              </div>
            </div>
          </div>
          
          <div class="accessories-grid">
            <h3>可用配饰</h3>
            <div class="accessories-list" id="accessoriesList">
              <!-- 配饰列表将通过JavaScript动态生成 -->
            </div>
          </div>
        </div>
        
        <!-- 成就标签页 -->
        <div class="tab-panel" id="achievements-panel">
          <div class="achievements-overview card glass">
            <div class="achievement-stats">
              <div class="stat-item">
                <div class="stat-number" id="totalAchievements">0</div>
                <div class="stat-label">已解锁成就</div>
              </div>
              <div class="stat-item">
                <div class="stat-number" id="achievementPoints">0</div>
                <div class="stat-label">成就点数</div>
              </div>
            </div>
          </div>
          
          <div class="achievements-list" id="achievementsList">
            <!-- 成就列表将通过JavaScript动态生成 -->
          </div>
        </div>
        
        <!-- 主题标签页 -->
        <div class="tab-panel" id="themes-panel">
          <div class="themes-grid" id="themesGrid">
            <!-- 主题列表将通过JavaScript动态生成 -->
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
    this.tabButtons = this.container.querySelectorAll('.tab-btn')
    this.tabPanels = this.container.querySelectorAll('.tab-panel')
    this.petAvatar = this.container.querySelector('#petAvatar')
    this.petName = this.container.querySelector('#petName')
    this.petAccessory = this.container.querySelector('#petAccessory')
    this.accessoriesList = this.container.querySelector('#accessoriesList')
    this.achievementsList = this.container.querySelector('#achievementsList')
    this.themesGrid = this.container.querySelector('#themesGrid')
    this.totalAchievements = this.container.querySelector('#totalAchievements')
    this.achievementPoints = this.container.querySelector('#achievementPoints')
  }

  bindEvents() {
    // 标签页切换事件
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.dataset.tab
        this.switchTab(tab)
      })
    })
  }

  init() {
    this.loadPetInfo()
    this.loadAccessories()
    this.loadAchievements()
    this.loadThemes()
  }

  switchTab(tab) {
    // 更新标签按钮状态
    this.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab)
    })
    
    // 更新标签面板状态
    this.tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `${tab}-panel`)
    })
    
    this.currentTab = tab
  }

  loadPetInfo() {
    if (window.dataManager) {
      const pet = window.dataManager.getPet()
      
      if (this.petName) this.petName.textContent = pet.name
      if (this.petAccessory) {
        const accessoryName = this.getAccessoryName(pet.equipped)
        this.petAccessory.textContent = `当前配饰：${accessoryName}`
      }
    }
  }

  loadAccessories() {
    if (!this.accessoriesList) return
    
    const accessories = [
      { id: 'spring_grass', name: '春天配饰', icon: '🌱', description: '春天的青草，充满生机', unlocked: true },
      { id: 'summer_fan', name: '夏天配饰', icon: '🌞', description: '夏天的扇子，带来清凉', unlocked: true },
      { id: 'autumn_fruit', name: '秋天配饰', icon: '🍎', description: '秋天的果实，收获满满', unlocked: true },
      { id: 'winter_scarf', name: '冬天配饰', icon: '❄️', description: '冬天的围巾，温暖舒适', unlocked: true },
      { id: 'crown', name: '皇冠', icon: '👑', description: '尊贵的皇冠，需要100成就点', unlocked: false, cost: 100 },
      { id: 'wings', name: '天使翅膀', icon: '👼', description: '美丽的天使翅膀，需要200成就点', unlocked: false, cost: 200 }
    ]
    
    this.accessoriesList.innerHTML = accessories.map(accessory => `
      <div class="accessory-item ${accessory.unlocked ? 'unlocked' : 'locked'}" data-id="${accessory.id}">
        <div class="accessory-icon">${accessory.icon}</div>
        <div class="accessory-info">
          <div class="accessory-name">${accessory.name}</div>
          <div class="accessory-description">${accessory.description}</div>
          ${!accessory.unlocked ? `<div class="accessory-cost">需要 ${accessory.cost} 成就点</div>` : ''}
        </div>
        <div class="accessory-actions">
          ${accessory.unlocked ? 
            `<button class="btn btn-primary equip-btn" data-id="${accessory.id}">装备</button>` :
            `<button class="btn btn-secondary unlock-btn" data-id="${accessory.id}" data-cost="${accessory.cost}">解锁</button>`
          }
        </div>
      </div>
    `).join('')
    
    // 绑定配饰事件
    this.bindAccessoryEvents()
  }

  bindAccessoryEvents() {
    // 装备配饰事件
    this.accessoriesList.querySelectorAll('.equip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const accessoryId = btn.dataset.id
        this.equipAccessory(accessoryId)
      })
    })
    
    // 解锁配饰事件
    this.accessoriesList.querySelectorAll('.unlock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const accessoryId = btn.dataset.id
        const cost = parseInt(btn.dataset.cost)
        this.unlockAccessory(accessoryId, cost)
      })
    })
  }

  equipAccessory(accessoryId) {
    if (window.dataManager) {
      window.dataManager.equipAccessory(accessoryId)
      this.loadPetInfo()
      
      // 显示成功提示
      this.showSuccessMessage('配饰装备成功！')
    }
  }

  unlockAccessory(accessoryId, cost) {
    if (window.dataManager) {
      const currentPoints = window.dataManager.getAchievementPoints()
      
      if (currentPoints >= cost) {
        // 解锁配饰
        // 这里需要扩展DataManager来支持配饰解锁
        this.showSuccessMessage('配饰解锁成功！')
        this.loadAccessories() // 重新加载配饰列表
      } else {
        this.showErrorMessage('成就点不足，无法解锁此配饰')
      }
    }
  }

  loadAchievements() {
    if (!this.achievementsList) return
    
    if (window.dataManager) {
      const achievements = window.dataManager.getAchievements()
      const totalPoints = window.dataManager.getAchievementPoints()
      
      // 更新统计信息
      if (this.totalAchievements) this.totalAchievements.textContent = achievements.length
      if (this.achievementPoints) this.achievementPoints.textContent = totalPoints
      
      // 生成成就列表
      this.achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement-item card glass">
          <div class="achievement-icon">🏆</div>
          <div class="achievement-info">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-meta">
              <span class="achievement-points">+${achievement.points} 点</span>
              <span class="achievement-date">${this.formatDate(achievement.unlockedAt)}</span>
            </div>
          </div>
        </div>
      `).join('')
      
      if (achievements.length === 0) {
        this.achievementsList.innerHTML = `
          <div class="no-achievements">
            <p>还没有解锁任何成就</p>
            <p>继续打卡，解锁更多成就吧！</p>
          </div>
        `
      }
    }
  }

  loadThemes() {
    if (!this.themesGrid) return
    
    const themes = [
      { id: 'default', name: '默认主题', description: '经典配色，适合日常使用', unlocked: true },
      { id: 'sunset', name: '夕阳主题', description: '温暖的橙红色调，带来温馨感受', unlocked: false, cost: 50 },
      { id: 'ocean', name: '海洋主题', description: '清新的蓝色调，仿佛置身海边', unlocked: false, cost: 80 },
      { id: 'forest', name: '森林主题', description: '自然的绿色调，充满生机活力', unlocked: false, cost: 120 }
    ]
    
    this.themesGrid.innerHTML = themes.map(theme => `
      <div class="theme-item card glass ${theme.unlocked ? 'unlocked' : 'locked'}">
        <div class="theme-preview" style="background: ${this.getThemePreview(theme.id)}"></div>
        <div class="theme-info">
          <h4>${theme.name}</h4>
          <p>${theme.description}</p>
          ${!theme.unlocked ? `<div class="theme-cost">需要 ${theme.cost} 成就点</div>` : ''}
        </div>
        <div class="theme-actions">
          ${theme.unlocked ? 
            `<button class="btn btn-primary apply-btn" data-id="${theme.id}">应用</button>` :
            `<button class="btn btn-secondary unlock-btn" data-id="${theme.id}" data-cost="${theme.cost}">解锁</button>`
          }
        </div>
      </div>
    `).join('')
    
    // 绑定主题事件
    this.bindThemeEvents()
  }

  bindThemeEvents() {
    // 应用主题事件
    this.themesGrid.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const themeId = btn.dataset.id
        this.applyTheme(themeId)
      })
    })
    
    // 解锁主题事件
    this.themesGrid.querySelectorAll('.unlock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const themeId = btn.dataset.id
        const cost = parseInt(btn.dataset.cost)
        this.unlockTheme(themeId, cost)
      })
    })
  }

  applyTheme(themeId) {
    // 这里需要扩展ThemeManager来支持主题切换
    this.showSuccessMessage('主题应用成功！')
  }

  unlockTheme(themeId, cost) {
    if (window.dataManager) {
      const currentPoints = window.dataManager.getAchievementPoints()
      
      if (currentPoints >= cost) {
        this.showSuccessMessage('主题解锁成功！')
        this.loadThemes() // 重新加载主题列表
      } else {
        this.showErrorMessage('成就点不足，无法解锁此主题')
      }
    }
  }

  getAccessoryName(accessoryId) {
    const names = {
      'spring_grass': '春天配饰',
      'summer_fan': '夏天配饰',
      'autumn_fruit': '秋天配饰',
      'winter_scarf': '冬天配饰',
      'crown': '皇冠',
      'wings': '天使翅膀'
    }
    return names[accessoryId] || '未知配饰'
  }

  getThemePreview(themeId) {
    const previews = {
      'default': 'linear-gradient(135deg, #667eea, #764ba2)',
      'sunset': 'linear-gradient(135deg, #ff9a9e, #fecfef)',
      'ocean': 'linear-gradient(135deg, #a8edea, #fed6e3)',
      'forest': 'linear-gradient(135deg, #84fab0, #8fd3f4)'
    }
    return previews[themeId] || previews.default
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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