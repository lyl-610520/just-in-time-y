export class BackgroundManager {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.animationId = null
    this.particles = []
    this.meteors = []
    this.treeCanvas = null
    this.treeCtx = null
    
    // 背景渐变配置
    this.gradients = {
      morning: ['#ff9a9e', '#fecfef', '#fecfef'],
      noon: ['#a8edea', '#fed6e3'],
      afternoon: ['#ffecd2', '#fcb69f'],
      evening: ['#ff9a9e', '#fecfef'],
      night: ['#667eea', '#764ba2', '#2c3e50']
    }
    
    // 天气效果配置
    this.weatherEffects = {
      sunny: { brightness: 1.2, saturation: 1.1 },
      cloudy: { brightness: 0.9, saturation: 0.8 },
      rainy: { brightness: 0.7, saturation: 0.6, blur: 2 },
      snowy: { brightness: 1.1, saturation: 0.9, blur: 1 }
    }
    
    this.currentTime = 'morning'
    this.currentWeather = 'sunny'
    this.isNight = false
  }

  init() {
    this.createCanvas()
    this.createTreeCanvas()
    this.initParticles()
    this.startAnimation()
    this.updateTimeOfDay()
    
    // 每分钟更新一次时间
    setInterval(() => {
      this.updateTimeOfDay()
    }, 60000)
  }

  createCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'backgroundCanvas'
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
    `
    
    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
    
    this.resizeCanvas()
    window.addEventListener('resize', () => this.resizeCanvas())
  }

  createTreeCanvas() {
    this.treeCanvas = document.createElement('canvas')
    this.treeCanvas.id = 'treeCanvas'
    this.treeCanvas.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      height: 400px;
      z-index: -1;
      pointer-events: none;
      opacity: 0.8;
    `
    
    document.body.appendChild(this.treeCanvas)
    this.treeCtx = this.treeCanvas.getContext('2d')
    
    this.drawSeasonalTree()
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  updateTimeOfDay() {
    const hour = new Date().getHours()
    
    if (hour >= 6 && hour < 10) {
      this.currentTime = 'morning'
      this.isNight = false
    } else if (hour >= 10 && hour < 14) {
      this.currentTime = 'noon'
      this.isNight = false
    } else if (hour >= 14 && hour < 18) {
      this.currentTime = 'afternoon'
      this.isNight = false
    } else if (hour >= 18 && hour < 22) {
      this.currentTime = 'evening'
      this.isNight = false
    } else {
      this.currentTime = 'night'
      this.isNight = true
    }
  }

  updateWeather(weather) {
    this.currentWeather = weather
  }

  initParticles() {
    this.particles = []
    this.meteors = []
    
    // 创建星星粒子
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      })
    }
    
    // 创建流星
    this.createMeteor()
  }

  createMeteor() {
    if (this.isNight && Math.random() < 0.01) {
      this.meteors.push({
        x: Math.random() * this.canvas.width,
        y: -50,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 5,
        size: Math.random() * 3 + 2,
        opacity: 1,
        trail: []
      })
    }
  }

  startAnimation() {
    const animate = () => {
      this.updateParticles()
      this.updateMeteors()
      this.drawBackground()
      this.drawParticles()
      this.drawMeteors()
      
      this.animationId = requestAnimationFrame(animate)
    }
    
    animate()
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.twinkle += 0.05
      particle.opacity = 0.2 + Math.sin(particle.twinkle) * 0.6
    })
  }

  updateMeteors() {
    this.meteors.forEach((meteor, index) => {
      meteor.x += meteor.vx
      meteor.y += meteor.vy
      
      // 添加轨迹
      meteor.trail.push({ x: meteor.x, y: meteor.y, opacity: meteor.opacity })
      if (meteor.trail.length > 20) {
        meteor.trail.shift()
      }
      
      // 移除超出屏幕的流星
      if (meteor.y > this.canvas.height || meteor.x < 0 || meteor.x > this.canvas.width) {
        this.meteors.splice(index, 1)
      }
    })
    
    // 创建新流星
    this.createMeteor()
  }

  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
    const colors = this.gradients[this.currentTime]
    
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color)
    })
    
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 应用天气效果
    this.applyWeatherEffects()
  }

  applyWeatherEffects() {
    const effects = this.weatherEffects[this.currentWeather]
    
    if (effects.brightness !== 1) {
      this.ctx.filter = `brightness(${effects.brightness})`
    }
    
    if (effects.saturation !== 1) {
      this.ctx.filter += ` saturate(${effects.saturation})`
    }
    
    if (effects.blur) {
      this.ctx.filter += ` blur(${effects.blur}px)`
    }
  }

  drawParticles() {
    if (!this.isNight) return
    
    this.particles.forEach(particle => {
      this.ctx.save()
      this.ctx.globalAlpha = particle.opacity
      this.ctx.fillStyle = '#ffffff'
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    })
  }

  drawMeteors() {
    this.meteors.forEach(meteor => {
      // 绘制轨迹
      this.ctx.save()
      this.ctx.strokeStyle = '#ffffff'
      this.ctx.lineWidth = 2
      this.ctx.lineCap = 'round'
      
      meteor.trail.forEach((point, index) => {
        const opacity = (index / meteor.trail.length) * meteor.opacity
        this.ctx.globalAlpha = opacity
        this.ctx.beginPath()
        if (index === 0) {
          this.ctx.moveTo(point.x, point.y)
        } else {
          this.ctx.lineTo(point.x, point.y)
        }
        this.ctx.stroke()
      })
      
      // 绘制流星头部
      this.ctx.globalAlpha = meteor.opacity
      this.ctx.fillStyle = '#ffffff'
      this.ctx.beginPath()
      this.ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.restore()
    })
  }

  drawSeasonalTree() {
    const month = new Date().getMonth()
    let season = 'spring'
    
    if (month >= 2 && month <= 4) season = 'spring'
    else if (month >= 5 && month <= 7) season = 'summer'
    else if (month >= 8 && month <= 10) season = 'autumn'
    else season = 'winter'
    
    this.drawTree(season)
  }

  drawTree(season) {
    const ctx = this.treeCtx
    const width = this.treeCanvas.width
    const height = this.treeCanvas.height
    
    ctx.clearRect(0, 0, width, height)
    
    // 树干
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(width / 2 - 10, height - 80, 20, 80)
    
    // 根据季节绘制不同的树冠
    switch (season) {
      case 'spring':
        this.drawSpringTree(ctx, width, height)
        break
      case 'summer':
        this.drawSummerTree(ctx, width, height)
        break
      case 'autumn':
        this.drawAutumnTree(ctx, width, height)
        break
      case 'winter':
        this.drawWinterTree(ctx, width, height)
        break
    }
  }

  drawSpringTree(ctx, width, height) {
    // 春天的粉色花朵
    const gradient = ctx.createRadialGradient(width / 2, height - 120, 0, width / 2, height - 120, 80)
    gradient.addColorStop(0, '#FFB6C1')
    gradient.addColorStop(0.5, '#FFC0CB')
    gradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(width / 2, height - 120, 80, 0, Math.PI * 2)
    ctx.fill()
    
    // 添加一些小花
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2
      const radius = 60 + Math.random() * 20
      const x = width / 2 + Math.cos(angle) * radius
      const y = height - 120 + Math.sin(angle) * radius
      
      ctx.fillStyle = '#FF69B4'
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  drawSummerTree(ctx, width, height) {
    // 夏天的绿色叶子
    const gradient = ctx.createRadialGradient(width / 2, height - 120, 0, width / 2, height - 120, 80)
    gradient.addColorStop(0, '#228B22')
    gradient.addColorStop(0.5, '#32CD32')
    gradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(width / 2, height - 120, 80, 0, Math.PI * 2)
    ctx.fill()
    
    // 添加一些深色叶子
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const radius = 50 + Math.random() * 30
      const x = width / 2 + Math.cos(angle) * radius
      const y = height - 120 + Math.sin(angle) * radius
      
      ctx.fillStyle = '#006400'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  drawAutumnTree(ctx, width, height) {
    // 秋天的橙色和红色叶子
    const colors = ['#FF8C00', '#FF4500', '#FF6347', '#FFA500']
    
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2
      const radius = 40 + Math.random() * 40
      const x = width / 2 + Math.cos(angle) * radius
      const y = height - 120 + Math.sin(angle) * radius
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  drawWinterTree(ctx, width, height) {
    // 冬天的白色雪花
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2
      const radius = 30 + Math.random() * 50
      const x = width / 2 + Math.cos(angle) * radius
      const y = height - 120 + Math.sin(angle) * radius
      
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // 树干上的雪
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fillRect(width / 2 - 12, height - 85, 24, 5)
  }

  // 更新天气效果
  updateWeatherEffects(weather) {
    this.currentWeather = weather
    this.drawSeasonalTree()
  }

  // 获取当前背景信息
  getBackgroundInfo() {
    return {
      time: this.currentTime,
      weather: this.currentWeather,
      isNight: this.isNight
    }
  }

  // 销毁组件
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas)
    }
    
    if (this.treeCanvas && this.treeCanvas.parentNode) {
      this.treeCanvas.parentNode.removeChild(this.treeCanvas)
    }
  }
}