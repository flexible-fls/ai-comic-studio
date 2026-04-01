/**
 * WebSocket 服务 - 实时生成进度推送
 */
const { WebSocketServer } = require('ws')

// 存储活跃连接
const clients = new Map()
const projectSubscriptions = new Map()

// 创建WebSocket服务器
function createWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws' })
  
  wss.on('connection', (ws, req) => {
    const clientId = generateClientId()
    clients.set(clientId, { ws, subscriptions: new Set() })
    
    console.log(`[WS] 客户端连接: ${clientId}`)
    
    // 发送连接成功消息
    sendToClient(clientId, {
      type: 'connected',
      clientId,
      timestamp: Date.now()
    })
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message)
        handleMessage(clientId, data)
      } catch (e) {
        console.error('[WS] 消息解析失败:', e)
      }
    })
    
    ws.on('close', () => {
      console.log(`[WS] 客户端断开: ${clientId}`)
      clients.delete(clientId)
      // 清理订阅
      projectSubscriptions.forEach((subscribers, projectId) => {
        subscribers.delete(clientId)
      })
    })
    
    ws.on('error', (error) => {
      console.error(`[WS] 错误 (${clientId}):`, error)
    })
  })
  
  return wss
}

// 处理客户端消息
function handleMessage(clientId, data) {
  const client = clients.get(clientId)
  if (!client) return
  
  switch (data.type) {
    case 'subscribe':
      // 订阅项目进度
      if (data.projectId) {
        subscribeToProject(clientId, data.projectId)
        sendToClient(clientId, {
          type: 'subscribed',
          projectId: data.projectId
        })
      }
      break
      
    case 'unsubscribe':
      // 取消订阅
      if (data.projectId) {
        unsubscribeFromProject(clientId, data.projectId)
      }
      break
      
    case 'ping':
      // 心跳检测
      sendToClient(clientId, { type: 'pong', timestamp: Date.now() })
      break
  }
}

// 订阅项目
function subscribeToProject(clientId, projectId) {
  if (!projectSubscriptions.has(projectId)) {
    projectSubscriptions.set(projectId, new Set())
  }
  projectSubscriptions.get(projectId).add(clientId)
  
  const client = clients.get(clientId)
  if (client) {
    client.subscriptions.add(projectId)
  }
  
  console.log(`[WS] ${clientId} 订阅了项目 ${projectId}`)
}

// 取消订阅
function unsubscribeFromProject(clientId, projectId) {
  const subscribers = projectSubscriptions.get(projectId)
  if (subscribers) {
    subscribers.delete(clientId)
  }
  
  const client = clients.get(clientId)
  if (client) {
    client.subscriptions.delete(projectId)
  }
  
  console.log(`[WS] ${clientId} 取消订阅项目 ${projectId}`)
}

// 发送消息到客户端
function sendToClient(clientId, data) {
  const client = clients.get(clientId)
  if (client && client.ws.readyState === 1) { // OPEN
    client.ws.send(JSON.stringify(data))
  }
}

// 广播消息到项目订阅者
function broadcastToProject(projectId, data) {
  const subscribers = projectSubscriptions.get(projectId)
  if (!subscribers) return
  
  const message = JSON.stringify({
    ...data,
    projectId,
    timestamp: Date.now()
  })
  
  subscribers.forEach(clientId => {
    const client = clients.get(clientId)
    if (client && client.ws.readyState === 1) {
      client.ws.send(message)
    }
  })
  
  console.log(`[WS] 广播到项目 ${projectId}: ${subscribers.size} 个订阅者`)
}

// 推送生成进度
function pushProgress(projectId, step, progress, status, details = {}) {
  broadcastToProject(projectId, {
    type: 'progress',
    step,
    progress,
    status, // 'processing' | 'completed' | 'error'
    ...details
  })
}

// 推送生成完成
function pushComplete(projectId, result) {
  broadcastToProject(projectId, {
    type: 'completed',
    status: 'completed',
    result
  })
}

// 推送错误
function pushError(projectId, error) {
  broadcastToProject(projectId, {
    type: 'error',
    status: 'error',
    error: error.message || error
  })
}

// 生成客户端ID
function generateClientId() {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 获取统计信息
function getStats() {
  return {
    totalClients: clients.size,
    totalSubscriptions: projectSubscriptions.size,
    projects: Array.from(projectSubscriptions.keys())
  }
}

module.exports = {
  createWebSocketServer,
  subscribeToProject,
  unsubscribeFromProject,
  broadcastToProject,
  pushProgress,
  pushComplete,
  pushError,
  sendToClient,
  getStats
}
