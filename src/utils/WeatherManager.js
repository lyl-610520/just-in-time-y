export class WeatherManager {
  constructor() {
    this.apiKey = 'f080dd8eccd341b4a06152132251207'
    this.baseUrl = 'https://api.weatherapi.com/v1'
    this.currentWeather = null
    this.location = null
    this.lastUpdate = null
    this.updateInterval = 5 * 60 * 1000 // 5分钟更新一次
    
    this.eventListeners = {}
  }

  async init() {
    try {
      // 获取用户位置
      await this.getUserLocation()
      
      // 获取初始天气
      await this.updateWeather()
      
      console.log('WeatherManager initialized successfully')
    } catch (error) {
      console.error('Failed to initialize WeatherManager:', error)
    }
  }

  async getUserLocation() {
    try {
      if ('geolocation' in navigator) {
        const position = await this.getCurrentPosition()
        this.location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }
      } else {
        // 如果无法获取位置，使用默认位置（北京）
        this.location = { lat: 39.9042, lon: 116.4074 }
      }
    } catch (error) {
      console.error('Failed to get user location:', error)
      // 使用默认位置
      this.location = { lat: 39.9042, lon: 116.4074 }
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10分钟缓存
      })
    })
  }

  async updateWeather() {
    if (!this.location) {
      console.warn('Location not available, cannot update weather')
      return
    }

    try {
      const now = Date.now()
      
      // 检查是否需要更新
      if (this.lastUpdate && (now - this.lastUpdate) < this.updateInterval) {
        return this.currentWeather
      }

      const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${this.location.lat},${this.location.lon}&aqi=no`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()
      
      this.currentWeather = {
        condition: data.current.condition.text,
        conditionCode: data.current.condition.code,
        temperature: data.current.temp_c,
        feelsLike: data.current.feelslike_c,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        windDir: data.current.wind_dir,
        pressure: data.current.pressure_mb,
        uv: data.current.uv,
        visibility: data.current.vis_km,
        lastUpdated: data.current.last_updated_epoch * 1000
      }
      
      this.lastUpdate = now
      
      // 触发天气更新事件
      this.emit('weatherUpdate', this.currentWeather)
      
      return this.currentWeather
    } catch (error) {
      console.error('Failed to update weather:', error)
      return null
    }
  }

  getCurrentWeather() {
    return this.currentWeather
  }

  getWeatherCondition() {
    if (!this.currentWeather) return 'unknown'
    
    const condition = this.currentWeather.condition.toLowerCase()
    
    if (condition.includes('sun') || condition.includes('clear')) {
      return 'sunny'
    } else if (condition.includes('cloud') || condition.includes('overcast')) {
      return 'cloudy'
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
      return 'rainy'
    } else if (condition.includes('snow') || condition.includes('sleet')) {
      return 'snowy'
    } else if (condition.includes('fog') || condition.includes('mist')) {
      return 'foggy'
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      return 'stormy'
    } else {
      return 'unknown'
    }
  }

  getWeatherIcon() {
    const condition = this.getWeatherCondition()
    
    const icons = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      foggy: '🌫️',
      stormy: '⛈️',
      unknown: '🌤️'
    }
    
    return icons[condition] || icons.unknown
  }

  getWeatherDescription() {
    if (!this.currentWeather) return ''
    
    const condition = this.getWeatherCondition()
    const temp = this.currentWeather.temperature
    
    let description = `${this.currentWeather.condition}，${temp}°C`
    
    // 根据温度添加感受描述
    if (temp < 0) {
      description += '，天气寒冷'
    } else if (temp < 10) {
      description += '，天气较冷'
    } else if (temp < 20) {
      description += '，天气凉爽'
    } else if (temp < 30) {
      description += '，天气温暖'
    } else {
      description += '，天气炎热'
    }
    
    return description
  }

  getWeatherComfortMessage() {
    const condition = this.getWeatherCondition()
    
    const messages = {
      sunny: '阳光明媚，心情也会变好呢',
      cloudy: '多云天气，适合外出散步',
      rainy: '下雨天，记得带伞哦',
      snowy: '下雪了，世界变得纯净美好',
      foggy: '雾天出行要注意安全',
      stormy: '雷雨天气，最好待在室内',
      unknown: '天气变化多端，注意适时调整'
    }
    
    return messages[condition] || messages.unknown
  }

  isNightTime() {
    if (!this.currentWeather) return false
    
    const now = new Date()
    const hour = now.getHours()
    
    // 晚上22点到早上6点算作夜晚
    return hour >= 22 || hour <= 6
  }

  getTimeOfDay() {
    const now = new Date()
    const hour = now.getHours()
    
    if (hour >= 6 && hour < 10) {
      return 'morning'
    } else if (hour >= 10 && hour < 14) {
      return 'noon'
    } else if (hour >= 14 && hour < 18) {
      return 'afternoon'
    } else if (hour >= 18 && hour < 22) {
      return 'evening'
    } else {
      return 'night'
    }
  }

  // 获取24小时天气变化（模拟数据，实际API需要付费）
  getHourlyForecast() {
    if (!this.currentWeather) return []
    
    const forecast = []
    const now = new Date()
    
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000)
      const hourNum = hour.getHours()
      
      // 模拟温度变化（白天高，夜晚低）
      let temp = this.currentWeather.temperature
      if (hourNum >= 6 && hourNum <= 18) {
        temp += Math.random() * 5 - 2.5 // 白天温度变化
      } else {
        temp -= Math.random() * 3 + 2 // 夜晚温度降低
      }
      
      forecast.push({
        hour: hourNum,
        temperature: Math.round(temp * 10) / 10,
        condition: this.currentWeather.condition,
        conditionCode: this.currentWeather.conditionCode
      })
    }
    
    return forecast
  }

  // 获取未来3天预报（模拟数据）
  getDailyForecast() {
    if (!this.currentWeather) return []
    
    const forecast = []
    const now = new Date()
    
    for (let i = 1; i <= 3; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
      
      // 模拟天气变化
      const conditions = ['sunny', 'cloudy', 'rainy', 'snowy']
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        condition: randomCondition,
        highTemp: Math.round(this.currentWeather.temperature + Math.random() * 8 - 4),
        lowTemp: Math.round(this.currentWeather.temperature + Math.random() * 6 - 8)
      })
    }
    
    return forecast
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