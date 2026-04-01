import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Clock, CheckCircle2, AlertCircle, Loader, 
  Play, Eye, Download, Share2, Trash2, RefreshCw,
  FileText, Image as ImageIcon, Video as VideoIcon,
  ChevronRight, Calendar, Filter, Search, MoreVertical
} from 'lucide-react'

const API_URL = 'http://localhost:3001/api'

// 历史记录类型
const HISTORY_TYPES = {
  SCRIPT_PARSE: { id: 'script', label: '剧本解析', icon: FileText, color: 'emerald' },
  CHARACTER: { id: 'character', label: '角色生成', icon: FileText, color: 'violet' },
  STORYBOARD: { id: 'storyboard', label: '分镜生成', icon: FileText, color: 'blue' },
  IMAGE: { id: 'image', label: '图片生成', icon: ImageIcon, color: 'cyan' },
  AUDIO: { id: 'audio', label: '配音生成', icon: FileText, color: 'pink' },
  VIDEO: { id: 'video', label: '视频生成', icon: VideoIcon, color: 'orange' },
  LIPSYNC: { id: 'lipsync', label: '口型同步', icon: FileText, color: 'amber' },
}

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    setLoading(true)
    
    // 模拟历史数据
    const mockHistory = [
      {
        id: '1',
        type: 'image',
        projectId: 'proj_001',
        projectTitle: '甜蜜恋爱 - 第一集',
        status: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5分钟前
        details: { prompt: '咖啡馆场景，阳光明媚', result: 'https://picsum.photos/400/300' },
        points: 10
      },
      {
        id: '2',
        type: 'video',
        projectId: 'proj_001',
        projectTitle: '甜蜜恋爱 - 第一集',
        status: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15分钟前
        details: { duration: 5, result: 'https://sample-videos.com/video.mp4' },
        points: 20
      },
      {
        id: '3',
        type: 'storyboard',
        projectId: 'proj_002',
        projectTitle: '星际穿越',
        status: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1小时前
        details: { scenes: 8 },
        points: 15
      },
      {
        id: '4',
        type: 'audio',
        projectId: 'proj_001',
        projectTitle: '甜蜜恋爱 - 第一集',
        status: 'error',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
        details: { error: 'TTS服务暂时不可用' },
        points: -10
      },
      {
        id: '5',
        type: 'character',
        projectId: 'proj_003',
        projectTitle: '龙族觉醒',
        status: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
        details: { characters: 4 },
        points: 15
      },
      {
        id: '6',
        type: 'lipsync',
        projectId: 'proj_001',
        projectTitle: '甜蜜恋爱 - 第一集',
        status: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45分钟前
        details: { duration: 3.5, method: 'Wav2Lip' },
        points: 25
      },
    ]
    
    setHistory(mockHistory)
    setLoading(false)
  }

  // 过滤历史记录
  const filteredHistory = history.filter(item => {
    // 类型过滤
    if (filter !== 'all' && item.type !== filter) return false
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.projectTitle.toLowerCase().includes(query) ||
        item.details?.prompt?.toLowerCase().includes(query) ||
        item.details?.error?.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  // 按时间分组
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let key
    if (date.toDateString() === today.toDateString()) {
      key = '今天'
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = '昨天'
    } else {
      key = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
    
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
    return groups
  }, {})

  // 格式化时间
  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // 获取类型信息
  const getTypeInfo = (type) => {
    return HISTORY_TYPES[type] || HISTORY_TYPES.SCRIPT_PARSE
  }

  return (
    <div className="min-h-screen bg-[#030308] relative overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 to-transparent rounded-full blur-[120px]" />
      </div>
      <div className="grid-bg opacity-20" />

      {/* 头部 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <nav className="backdrop-blur-2xl bg-black/40 border border-white/[0.08] rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>返回控制台</span>
              </button>
              <h1 className="text-lg font-bold text-white">生成历史</h1>
              <button onClick={loadHistory} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: '总记录', value: history.length, icon: Clock, color: 'emerald' },
              { label: '成功', value: history.filter(h => h.status === 'success').length, icon: CheckCircle2, color: 'emerald' },
              { label: '失败', value: history.filter(h => h.status === 'error').length, icon: AlertCircle, color: 'red' },
              { label: '消耗积分', value: history.reduce((sum, h) => sum + (h.points || 0), 0), icon: Loader, color: 'amber' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center"
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 text-${stat.color}-400`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* 筛选栏 */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* 搜索框 */}
<div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索历史记录..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* 类型筛选 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === 'all' 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                全部
              </button>
              {Object.values(HISTORY_TYPES).map(type => (
                <button
                  key={type.id}
                  onClick={() => setFilter(type.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    filter === type.id 
                      ? 'bg-emerald-500 text-black' 
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 历史列表 */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full"
              />
            </div>
          ) : Object.keys(groupedHistory).length === 0 ? (
            <div className="text-center py-20">
              <Clock className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-500">暂无历史记录</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-zinc-500" />
                    {date}
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {items.map((item, i) => {
                        const typeInfo = getTypeInfo(item.type)
                        const TypeIcon = typeInfo.icon
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center gap-4 p-5">
                              {/* 图标 */}
                              <div className={`w-12 h-12 rounded-xl bg-${typeInfo.color}-500/20 flex items-center justify-center shrink-0`}>
                                <TypeIcon className={`w-6 h-6 text-${typeInfo.color}-400`} />
                              </div>

                              {/* 内容 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    item.status === 'success' 
                                      ? 'bg-emerald-500/20 text-emerald-400' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {item.status === 'success' ? '成功' : '失败'}
                                  </span>
                                  <span className="text-sm text-zinc-500">{typeInfo.label}</span>
                                </div>
                                <p className="font-medium text-white truncate">{item.projectTitle}</p>
                                <p className="text-sm text-zinc-500 truncate">
                                  {item.details?.prompt || item.details?.error || `${typeInfo.label}完成`}
                                </p>
                              </div>

                              {/* 时间和积分 */}
                              <div className="text-right shrink-0">
                                <p className="text-sm text-zinc-500">{formatTime(item.createdAt)}</p>
                                <p className={`text-sm font-medium ${item.points > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                                  {item.points > 0 ? '+' : ''}{item.points}积分
                                </p>
                              </div>

                              {/* 操作 */}
                              <div className="flex items-center gap-2 shrink-0">
                                {item.status === 'success' && item.details?.result && (
                                  <>
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all">
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                <button className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* 错误信息 */}
                            {item.status === 'error' && item.details?.error && (
                              <div className="px-5 pb-4">
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                                  错误原因: {item.details.error}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
