/**
 * WebSocket Hook - 实时生成进度
 */
import { useEffect, useRef, useCallback, useState } from 'react'

const WS_URL = 'ws://localhost:3001/ws'
const RECONNECT_INTERVAL = 3000
const MAX_RECONNECT_ATTEMPTS = 5

export default function useWebSocket(projectId) {
  const wsRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeout = useRef(null)
  
  const [isConnected, setIsConnected] = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)
  
  // 消息处理回调
  const onProgress = useRef(null)
  const onComplete = useRef(null)
  const onError = useRef(null)
  
  // 设置回调
  const setCallbacks = useCallback((callbacks) => {
    if (callbacks.onProgress) onProgress.current = callbacks.onProgress
    if (callbacks.onComplete) onComplete.current = callbacks.onComplete
    if (callbacks.onError) onError.current = callbacks.onError
  }, [])
  
  // 连接WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    
    try {
      wsRef.current = new WebSocket(WS_URL)
      
      wsRef.current.onopen = () => {
        console.log('[WS] Connected')
        setIsConnected(true)
        reconnectAttempts.current = 0
        
        // 订阅项目
        if (projectId) {
          wsRef.current.send(JSON.stringify({
            type: 'subscribe',
            projectId
          }))
        }
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'connected':
              console.log('[WS] Server acknowledged:', data.clientId)
              break
              
            case 'subscribed':
              console.log('[WS] Subscribed to:', data.projectId)
              break
              
            case 'progress':
              setProgress(data)
              onProgress.current?.(data)
              break
              
            case 'completed':
              onComplete.current?.(data)
              break
              
            case 'error':
              setError(data.error)
              onError.current?.(data.error)
              break
              
            case 'pong':
              // 心跳响应
              break
          }
        } catch (e) {
          console.error('[WS] Parse error:', e)
        }
      }
      
      wsRef.current.onclose = () => {
        console.log('[WS] Disconnected')
        setIsConnected(false)
        
        // 自动重连
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current++
          console.log(`[WS] Reconnecting... (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`)
          reconnectTimeout.current = setTimeout(connect, RECONNECT_INTERVAL)
        }
      }
      
      wsRef.current.onerror = (err) => {
        console.error('[WS] Error:', err)
        setError('WebSocket连接错误')
      }
      
    } catch (e) {
      console.error('[WS] Connection failed:', e)
    }
  }, [projectId])
  
  // 断开连接
  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
  }, [])
  
  // 订阅项目
  const subscribe = useCallback((newProjectId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && newProjectId) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        projectId: newProjectId
      }))
    }
  }, [])
  
  // 取消订阅
  const unsubscribe = useCallback((targetProjectId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && targetProjectId) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        projectId: targetProjectId
      }))
    }
  }, [])
  
  // 发送ping
  const ping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }))
    }
  }, [])
  
  // 组件挂载时连接
  useEffect(() => {
    connect()
    
    // 心跳保活
    const pingInterval = setInterval(ping, 30000)
    
    return () => {
      clearInterval(pingInterval)
      disconnect()
    }
  }, [connect, disconnect, ping])
  
  // 项目ID变化时重新订阅
  useEffect(() => {
    if (isConnected && projectId) {
      subscribe(projectId)
    }
  }, [isConnected, projectId, subscribe])
  
  return {
    isConnected,
    progress,
    error,
    setCallbacks,
    subscribe,
    unsubscribe,
    disconnect,
    reconnect: connect
  }
}

// WebSocket状态枚举
export const WS_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
}

// 生成步骤映射
export const STEP_NAMES = {
  'script': '剧本解析',
  'characters': '角色生成',
  'storyboard': '分镜生成',
  'images': '图片生成',
  'audio': '配音生成',
  'lipsync': '口型同步',
  'video': '视频合成'
}
