import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Download, Image as ImageIcon, Sparkles, Zap, 
  Check, Loader, Plus, Trash2, Play, Volume2, FileText, 
  Users, Layers, ChevronRight, Save, Wand2, User, RefreshCw,
  MessageSquare, Camera, Video as VideoIcon, Eye,
  Heart, Share2, Settings, ArrowRight, PlayCircle, Clock,
  Wand, Palette, ChevronLeft, Sparkle, AlertCircle, CheckCircle2,
  X, Pause, SkipForward, EyeOff, Copy, ExternalLink, Music,
  Mic, Speaker, Laugh
} from 'lucide-react'

const API_URL = 'http://localhost:3001/api'

// 生成步骤定义
const GENERATION_STEPS = [
  { id: 'script', name: '剧本解析', icon: FileText, desc: '分析剧本内容' },
  { id: 'characters', name: '角色生成', icon: Users, desc: '生成角色设定' },
  { id: 'storyboard', name: '分镜生成', icon: Layers, desc: '生成故事分镜' },
  { id: 'images', name: '图片生成', icon: ImageIcon, desc: 'AI绘制场景' },
  { id: 'audio', name: '配音生成', icon: Volume2, desc: 'TTS语音合成' },
  { id: 'lipsync', name: '口型同步', icon: Laugh, desc: '口型对齐' },
  { id: 'video', name: '视频合成', icon: VideoIcon, desc: '生成最终视频' },
]

export default function WorkflowDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, updateProject } = useStore()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generationProgress, setGenerationProgress] = useState({})
  const [error, setError] = useState(null)
  const [selectedShot, setSelectedShot] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  
  // 模拟生成进度
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const found = projects.find(p => p.id === id)
    if (found) {
      setProject(found)
    } else {
      // 创建示例项目
      const demoProject = {
        id,
        title: '示例漫剧项目',
        script: '【场景】咖啡馆内，午后阳光透过窗户\n【角色】林悦坐在窗边，看着窗外的街道\n【台词】林悦：今天天气真好呀...',
        style: '2d_jp',
        status: 'draft',
        createdAt: new Date().toISOString(),
        characters: [],
        storyboard: [],
        shots: [
          { id: 1, scene: '场景1', description: '咖啡馆内景，阳光明媚', dialogue: '今天天气真好呀...' },
          { id: 2, scene: '场景2', description: '窗外街景，行人走过', dialogue: '街上好热闹啊' },
          { id: 3, scene: '场景3', description: '林悦看向窗外', dialogue: '在想什么呢...' },
        ]
      }
      setProject(demoProject)
    }
    setLoading(false)
  }, [id, projects])

  // 开始生成流程
  const handleGenerate = async () => {
    if (!project) return
    
    setGenerating(true)
    setError(null)
    setProgress(0)
    
    try {
      // 模拟分步生成
      const steps = ['script', 'characters', 'storyboard', 'images', 'audio', 'lipsync', 'video']
      
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        setGenerationProgress(prev => ({ ...prev, [steps[i]]: 'processing' }))
        
        // 模拟每步耗时
        await simulateStep(steps[i])
        
        setGenerationProgress(prev => ({ ...prev, [steps[i]]: 'completed' }))
        setProgress(Math.round(((i + 1) / steps.length) * 100))
        
        // 更新项目状态
        updateProject(id, { status: 'processing', progress: Math.round(((i + 1) / steps.length) * 100) })
      }
      
      // 生成完成
      setGenerating(false)
      updateProject(id, { status: 'completed', progress: 100 })
      
    } catch (err) {
      setError(err.message)
      setGenerating(false)
    }
  }

  // 模拟每步生成
  const simulateStep = async (step) => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (step === 'script') {
          // 剧本解析完成
        } else if (step === 'characters') {
          // 角色生成完成
        } else if (step === 'storyboard') {
          // 分镜生成完成
        } else if (step === 'images') {
          // 图片生成完成
        } else if (step === 'audio') {
          // 配音生成完成
        } else if (step === 'lipsync') {
          // 口型同步完成
        } else if (step === 'video') {
          // 视频合成完成
        }
        resolve()
      }, 1500 + Math.random() * 1000)
    })
  }

  // 重新生成某个步骤
  const handleRegenerateStep = async (stepId) => {
    setGenerationProgress(prev => ({ ...prev, [stepId]: 'processing' }))
    await simulateStep(stepId)
    setGenerationProgress(prev => ({ ...prev, [stepId]: 'completed' }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030308] relative overflow-hidden">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-[100px]" />
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
              <h1 className="text-lg font-bold text-white">{project?.title || '项目详情'}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-xl text-sm font-bold ${
                  project?.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  project?.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-white/10 text-zinc-400'
                }`}>
                  {project?.status === 'completed' ? '已完成' : 
                   project?.status === 'processing' ? '处理中' : '待处理'}
                </span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* 进度概览 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl mb-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-emerald-500/20" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            
            <div className="relative p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">生成进度</h2>
                  <p className="text-zinc-400">AI 正在为您创作，请耐心等待...</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {progress}%
                  </div>
                  <p className="text-sm text-zinc-500">完成度</p>
                </div>
              </div>

              {/* 进度条 */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-8">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* 步骤指示器 */}
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {GENERATION_STEPS.map((step, i) => {
                  const status = generationProgress[step.id] || 
                    (project?.status === 'completed' ? 'completed' : 
                     (i < currentStep ? 'completed' : i === currentStep ? 'processing' : 'pending'))
                  const Icon = step.icon
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`
                        relative p-4 rounded-2xl text-center transition-all
                        ${status === 'completed' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                          status === 'processing' ? 'bg-cyan-500/20 border border-cyan-500/30 animate-pulse' :
                          'bg-white/5 border border-white/10'}
                      `}
                    >
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                        status === 'completed' ? 'bg-emerald-500/30' :
                        status === 'processing' ? 'bg-cyan-500/30' :
                        'bg-white/10'
                      }`}>
                        {status === 'completed' ? (
                          <Check className="w-6 h-6 text-emerald-400" />
                        ) : status === 'processing' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader className="w-6 h-6 text-cyan-400" />
                          </motion.div>
                        ) : (
                          <Icon className="w-6 h-6 text-zinc-500" />
                        )}
                      </div>
                      <p className={`text-sm font-medium ${
                        status === 'completed' ? 'text-emerald-400' :
                        status === 'processing' ? 'text-cyan-400' :
                        'text-zinc-500'
                      }`}>{step.name}</p>
                    </motion.div>
                  )
                })}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-center gap-4 mt-8">
                {!generating && project?.status !== 'completed' && (
                  <motion.button
                    onClick={handleGenerate}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-2xl shadow-xl shadow-emerald-500/30"
                  >
                    <Wand2 className="w-6 h-6" />
                    开始生成
                  </motion.button>
                )}
                
                {generating && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-2xl"
                  >
                    <Loader className="w-6 h-6 animate-spin" />
                    生成中...
                  </motion.button>
                )}

                {project?.status === 'completed' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/30"
                  >
                    <Play className="w-6 h-6" />
                    预览作品
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧 - 分镜列表 */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 分镜标题 */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Layers className="w-6 h-6 text-emerald-400" />
                  分镜列表
                </h3>
                <span className="text-zinc-500">{project?.shots?.length || 0} 个分镜</span>
              </div>

              {/* 分镜卡片 */}
              <div className="space-y-4">
                {project?.shots?.map((shot, i) => (
                  <motion.div
                    key={shot.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedShot(shot)}
                    className={`
                      relative overflow-hidden rounded-2xl border cursor-pointer transition-all
                      ${selectedShot?.id === shot.id 
                        ? 'border-emerald-500/50 bg-emerald-500/5' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'}
                    `}
                  >
                    <div className="flex gap-4 p-5">
                      {/* 缩略图 */}
                      <div className="w-32 h-24 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {shot.image ? (
                          <img src={shot.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-zinc-600" />
                        )}
                      </div>
                      
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-zinc-500">第 {i + 1} 镜</span>
                          <div className="flex items-center gap-2">
                            {shot.status === 'completed' ? (
                              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs">
                                <Check className="w-3 h-3" /> 完成
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs">
                                <Loader className="w-3 h-3" /> 待生成
                              </span>
                            )}
                          </div>
                        </div>
                        <h4 className="font-bold text-white mb-1">{shot.scene}</h4>
                        <p className="text-sm text-zinc-500 line-clamp-2">{shot.description}</p>
                        {shot.dialogue && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
                            <MessageSquare className="w-4 h-4" />
                            <span>"{shot.dialogue}"</span>
                          </div>
                        )}
                      </div>

                      {/* 操作 */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 transition-all">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 错误提示 */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4"
                  >
                    <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                    <div>
                      <p className="font-medium text-red-400">生成失败</p>
                      <p className="text-sm text-zinc-400 mt-1">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-500/20 rounded-lg">
                      <X className="w-5 h-5 text-zinc-500" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 右侧 - 详情面板 */}
            <div className="space-y-6">
              
              {/* 剧本预览 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10"
              >
                <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  剧本内容
                </h4>
                <div className="p-4 rounded-xl bg-black/40 text-sm text-zinc-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {project?.script || '暂无剧本内容'}
                </div>
              </motion.div>

              {/* 角色列表 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10"
              >
                <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-violet-400" />
                  角色设定
                </h4>
                <div className="space-y-3">
                  {project?.characters?.length > 0 ? (
                    project.characters.map((char, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                          {char.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-white">{char.name}</p>
                          <p className="text-xs text-zinc-500 line-clamp-1">{char.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-zinc-500">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暂无角色设定</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* 积分消耗 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10"
              >
                <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-400" />
                  积分消耗
                </h4>
                <div className="space-y-3">
                  {GENERATION_STEPS.map((step, i) => (
                    <div key={step.id} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">{step.name}</span>
                      <span className="text-amber-400 font-medium">
                        {step.id === 'script' ? '免费' : '-10'}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-medium text-white">总计</span>
                    <span className="text-xl font-black text-amber-400">-60</span>
                  </div>
                </div>
              </motion.div>

              {/* 快捷操作 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                  <Download className="w-5 h-5" />
                  <span className="text-sm">导出</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">分享</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
