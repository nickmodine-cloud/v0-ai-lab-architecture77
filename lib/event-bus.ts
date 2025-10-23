class EventBus {
  private events: Map<string, Function[]> = new Map()
  private ws: WebSocket | null = null

  constructor() {
    this.initWebSocket()
  }

  private initWebSocket() {
    if (typeof window !== 'undefined') {
      this.ws = new WebSocket('ws://localhost:5001/ws')
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit(data.type, data.payload)
        } catch (error) {
          console.error('WebSocket message error:', error)
        }
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        // Переподключаемся через 5 секунд
        setTimeout(() => this.initWebSocket(), 5000)
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    }
  }

  emit(event: string, data: any) {
    // Вызываем локальные обработчики
    this.events.get(event)?.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error)
      }
    })
    
    // Отправляем на сервер через WebSocket
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: event, payload: data }))
    }
  }

  on(event: string, callback: Function) {
    if (!this.events.has(event)) this.events.set(event, [])
    this.events.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
    }
  }

  // Специальные события для интеграции
  emitHypothesisCreated(hypothesis: any) {
    this.emit('hypothesisCreated', hypothesis)
    this.emit('ceoDashboardUpdate', { type: 'hypothesisCreated', data: hypothesis })
    this.emit('notificationsUpdate', { 
      type: 'hypothesisCreated', 
      data: {
        title: 'Новая гипотеза создана',
        message: `Гипотеза "${hypothesis.title}" была создана`,
        userId: hypothesis.createdBy
      }
    })
  }

  emitHypothesisUpdated(hypothesis: any) {
    this.emit('hypothesisUpdated', hypothesis)
    this.emit('ceoDashboardUpdate', { type: 'hypothesisUpdated', data: hypothesis })
    this.emit('kanbanUpdate', { type: 'hypothesisUpdated', data: hypothesis })
  }

  emitExperimentCompleted(experiment: any) {
    this.emit('experimentCompleted', experiment)
    this.emit('ceoDashboardUpdate', { type: 'experimentCompleted', data: experiment })
    this.emit('notificationsUpdate', {
      type: 'experimentCompleted',
      data: {
        title: 'Эксперимент завершен',
        message: `Эксперимент "${experiment.title}" успешно завершен`,
        userId: experiment.createdBy
      }
    })
  }

  emitStageUpdated(stageId: number, isActive: boolean) {
    this.emit('stageUpdated', { stageId, isActive })
    this.emit('kanbanUpdate', { type: 'stageUpdated', data: { stageId, isActive } })
  }

  emitSettingsUpdated(settings: any) {
    this.emit('settingsUpdated', settings)
  }
}

export const eventBus = new EventBus()


