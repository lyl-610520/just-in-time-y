export class StatsPage {
  constructor() {
    this.container = null
    this.charts = {}
  }

  render() {
    this.container = document.createElement('div')
    this.container.className = 'stats-page'
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
        <h1>数据统计</h1>
        <p>了解你的打卡习惯和成长轨迹</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card card glass">
          <h3>打卡类别分布</h3>
          <div class="chart-container">
            <canvas id="categoryChart" width="300" height="300"></canvas>
          </div>
        </div>
        
        <div class="stat-card card glass">
          <h3>睡眠时长趋势</h3>
          <div class="chart-container">
            <canvas id="sleepChart" width="300" height="200"></canvas>
          </div>
        </div>
        
        <div class="stat-card card glass">
          <h3>连续打卡天数</h3>
          <div class="streak-display">
            <div class="streak-number" id="streakNumber">0</div>
            <div class="streak-label">天</div>
          </div>
        </div>
        
        <div class="stat-card card glass">
          <h3>总打卡次数</h3>
          <div class="total-display">
            <div class="total-number" id="totalNumber">0</div>
            <div class="total-label">次</div>
          </div>
        </div>
      </div>
    `
    
    this.init()
    return this.container
  }

  init() {
    this.loadStats()
    this.createCharts()
  }

  loadStats() {
    // 从DataManager获取统计数据
    if (window.dataManager) {
      const stats = window.dataManager.getStats()
      const streakDays = window.dataManager.getStreakDays()
      
      // 更新显示
      const streakElement = this.container.querySelector('#streakNumber')
      const totalElement = this.container.querySelector('#totalNumber')
      
      if (streakElement) streakElement.textContent = streakDays
      if (totalElement) totalElement.textContent = stats.totalCheckins
    }
  }

  createCharts() {
    // 创建类别分布饼图
    this.createCategoryChart()
    
    // 创建睡眠趋势折线图
    this.createSleepChart()
  }

  createCategoryChart() {
    const canvas = this.container.querySelector('#categoryChart')
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    
    // 获取打卡数据
    let data = { life: 0, study: 0, work: 0 }
    if (window.dataManager) {
      const checkins = window.dataManager.getAllCheckins()
      checkins.forEach(checkin => {
        if (checkin.category && data[checkin.category] !== undefined) {
          data[checkin.category]++
        }
      })
    }
    
    // 绘制饼图
    this.drawPieChart(ctx, canvas.width, canvas.height, data)
  }

  drawPieChart(ctx, width, height, data) {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    const labels = ['生活', '学习', '工作']
    
    let total = Object.values(data).reduce((sum, value) => sum + value, 0)
    if (total === 0) total = 1
    
    let currentAngle = -Math.PI / 2
    
    Object.entries(data).forEach(([category, value], index) => {
      const sliceAngle = (value / total) * 2 * Math.PI
      
      // 绘制扇形
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = colors[index]
      ctx.fill()
      
      // 绘制标签
      const labelAngle = currentAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius
      
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(labels[index], labelX, labelY)
      
      currentAngle += sliceAngle
    })
  }

  createSleepChart() {
    const canvas = this.container.querySelector('#sleepChart')
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    
    // 获取睡眠数据
    let sleepData = this.generateSleepData()
    
    // 绘制折线图
    this.drawLineChart(ctx, canvas.width, canvas.height, sleepData)
  }

  generateSleepData() {
    // 生成最近7天的睡眠数据
    const data = []
    const now = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // 模拟睡眠时长（6-9小时）
      const sleepHours = 6 + Math.random() * 3
      
      data.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        hours: Math.round(sleepHours * 10) / 10
      })
    }
    
    return data
  }

  drawLineChart(ctx, width, height, data) {
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    
    // 清空画布
    ctx.clearRect(0, 0, width, height)
    
    // 绘制坐标轴
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    
    // X轴
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    
    // Y轴
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()
    
    // 绘制数据点
    if (data.length > 1) {
      ctx.strokeStyle = '#4ECDC4'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      data.forEach((item, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const y = height - padding - (item.hours / 10) * chartHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        
        // 绘制数据点
        ctx.fillStyle = '#4ECDC4'
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
      
      ctx.stroke()
    }
    
    // 绘制标签
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    
    // X轴标签
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth
      ctx.fillText(item.date, x, height - padding + 20)
    })
    
    // Y轴标签
    for (let i = 0; i <= 10; i += 2) {
      const y = height - padding - (i / 10) * chartHeight
      ctx.textAlign = 'right'
      ctx.fillText(`${i}h`, padding - 10, y + 4)
    }
  }

  destroy() {
    // 清理图表资源
    this.charts = {}
  }
}