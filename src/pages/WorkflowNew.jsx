import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Sparkles, Zap, ArrowRight, Palette, Film, 
  Wand2, Check, ChevronRight, Star, Flame,
  Heart, MessageCircle, Eye, Play, Clock, Sparkle,
  Image as ImageIcon, Wand, Sparkle as SparkleIcon, Camera, Music
} from 'lucide-react'

const API_URL = 'http://localhost:3001/api'

const styles = [
  { id: '2d_jp', name: '日系动漫', icon: '🎨', desc: '清新唯美的日漫画风', gradient: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/30' },
  { id: '3d_cn', name: '3D国漫', icon: '🎭', desc: '高品质3D建模，精细画质', gradient: 'from-violet-500 to-indigo-500', glow: 'shadow-violet-500/30' },
  { id: 'comic', name: '美漫', icon: '🦸', desc: '美式漫画风格，强烈对比', gradient: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/30' },
  { id: 'ink', name: '水墨', icon: '🖌️', desc: '传统水墨画风格', gradient: 'from-gray-500 to-gray-700', glow: 'shadow-gray-500/30' },
]

const templates = [
  { id: 1, title: '甜蜜恋爱', style: '2d_jp', desc: '怦然心动的都市爱情', cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop', views: '2.3w', likes: '890', badge: '热门' },
  { id: 2, title: '仙侠逆袭', style: '3d_cn', desc: '废柴少年逆天改命', cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=300&fit=crop', views: '1.8w', likes: '654', badge: '新品' },
  { id: 3, title: '都市豪门', style: 'comic', desc: '霸道总裁的宠溺', cover: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=300&fit=crop', views: '3.1w', likes: '1.2k', badge: '热门' },
  { id: 4, title: '古风权谋', style: 'ink', desc: '深宫大院的爱恨情仇', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop', views: '1.5w', likes: '432' },
]

const steps = [
  { num: 1, label: '选择风格', icon: Palette, color: 'emerald' },
  { num: 2, label: '填写剧本', icon: Film, color: 'violet' },
  { num: 3, label: '开始创作', icon: Sparkles, color: 'cyan' },
]

export default function WorkflowNew() {
  const navigate = useNavigate()
  const { addProject } = useStore()
  const [title, setTitle] = useState('')
  const [script, setScript] = useState('')
  const [style, setStyle] = useState('2d_jp')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const userPoints = 999999

  const selectedStyle = styles.find(s => s.id === style)

  const handleCreate = async () => {
    if (!title.trim()) { alert('请输入项目标题'); return }
    if (!script.trim()) { alert('请输入剧本内容'); return }
    
    setLoading(true)
    const token = localStorage.getItem('token') || 'demo-token'
    
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, script, style })
      })
      const data = await res.json()
      if (data.project) {
        addProject(data.project)
        navigate(`/workflow/${data.project.id}`)
      } else {
        const demoId = 'demo_' + Date.now()
        addProject({ id: demoId, title, script, style, status: 'processing', createdAt: new Date().toISOString() })
        navigate(`/workflow/${demoId}`)
      }
    } catch (err) {
      const demoId = 'demo_' + Date.now()
      addProject({ id: demoId, title, script, style, status: 'processing', createdAt: new Date().toISOString() })
      navigate(`/workflow/${demoId}`)
    }
    setLoading(false)
  }

  const selectTemplate = (template) => {
    setStyle(template.style)
    setTitle(template.title)
    setStep(2)
  }

  return (
    <div className="min-h-screen bg-[#030308] relative overflow-hidden">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* 网格背景 */}
      <div className="grid-bg opacity-30" />

      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <nav className=" backdrop-blur-2xl bg-black/40 border border-white/[0.08] rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>返回控制台</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/20">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-lg">{userPoints.toLocaleString()}</span>
                  <span className="text-zinc-500 text-sm">积分</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* 欢迎横幅 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-violet-500/20" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            
            <div className="relative p-10 md:p-14">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                    创建新作品
                  </h1>
                  <p className="text-xl text-zinc-400">从剧本到视频，AI 帮你一键搞定</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <SparkleIcon className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                    <p className="text-sm text-zinc-400">智能分析</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <Heart className="w-10 h-10 mx-auto mb-2 text-violet-400" />
                    <p className="text-sm text-zinc-400">角色一致</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <Camera className="w-10 h-10 mx-auto mb-2 text-cyan-400" />
                    <p className="text-sm text-zinc-400">自动配音</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 步骤指示器 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <motion.button
                  onClick={() => s.num < step && setStep(s.num)}
                  whileHover={{ scale: s.num < step ? 1.05 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-4 px-8 py-5 rounded-2xl font-semibold transition-all duration-300
                    ${step === s.num 
                      ? s.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-xl shadow-emerald-500/30' :
                        s.color === 'violet' ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-xl shadow-violet-500/30' :
                        'bg-gradient-to-r from-cyan-400 to-blue-400 text-black shadow-xl shadow-cyan-500/30'
                      : step > s.num 
                      ? 'bg-white/5 border border-emerald-500/30 text-emerald-400 cursor-pointer hover:bg-emerald-500/10'
                      : 'bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed'}
                  `}
                >
                  {step > s.num ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <s.icon className="w-6 h-6" />
                  )}
                  <span className="text-lg">{s.label}</span>
                </motion.button>
                {i < 2 && (
                  <ChevronRight className={`w-6 h-6 mx-4 ${step > s.num ? 'text-emerald-400' : 'text-zinc-600'}`} />
                )}
              </div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                {/* 风格选择 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Palette className="w-7 h-7 text-emerald-400" />
                    选择创作风格
                  </h2>
                  <div className="grid md:grid-cols-4 gap-5">
                    {styles.map((s, i) => (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStyle(s.id)}
                        className={`
                          relative p-6 rounded-3xl border-2 text-center transition-all duration-300 overflow-hidden
                          ${style === s.id 
                            ? `border-emerald-400 bg-emerald-500/10 shadow-xl ${s.glow}`
                            : 'border-white/10 bg-white/5 hover:border-white/20'}
                        `}
                      >
                        {style === s.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg"
                          >
                            <Check className="w-6 h-6 text-black" />
                          </motion.div>
                        )}
                        <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-4xl shadow-lg`}>
                          {s.icon}
                        </div>
                        <p className="font-bold text-lg text-white mb-2">{s.name}</p>
                        <p className="text-sm text-zinc-500">{s.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 热门模板 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Flame className="w-7 h-7 text-orange-400" />
                    热门模板
                  </h2>
                  <div className="grid md:grid-cols-4 gap-5">
                    {templates.map((t, i) => (
                      <motion.button
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -6 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectTemplate(t)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-orange-500/30 transition-all"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={t.cover} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          {t.badge && (
                            <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                              {t.badge}
                            </div>
                          )}
                          <p className="font-bold text-xl text-white mb-1">{t.title}</p>
                          <p className="text-sm text-zinc-400 mb-3">{t.desc}</p>
                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {t.views}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {t.likes}</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button 
                  onClick={() => setStep(2)} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all"
                >
                  下一歩 <ArrowRight className="w-6 h-6 inline ml-2" />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* 已选风格提示 */}
                <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedStyle?.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                      {selectedStyle?.icon}
                    </div>
                    <div>
                      <p className="font-bold text-xl text-white">{selectedStyle?.name}</p>
                      <p className="text-zinc-400">{selectedStyle?.desc}</p>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-sm text-emerald-400 hover:underline font-medium">
                    更改风格
                  </button>
                </div>

                {/* 项目标题 */}
                <div>
                  <label className="block text-lg font-medium mb-4 text-white">
                    项目标题
                    <span className="text-zinc-500 ml-3 font-normal">给你的作品起个名字</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：《星际穿越》第一集"
                    className="w-full px-6 py-5 text-lg bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"
                  />
                </div>

                {/* 剧本内容 */}
                <div>
                  <label className="block text-lg font-medium mb-4 text-white">
                    剧本内容
                    <span className="text-zinc-500 ml-3 font-normal">AI 会自动识别角色、场景、台词</span>
                  </label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder={`在这里输入你的剧本内容..

📝 推荐格式：
【场景】咖啡馆内，午后阳光透过窗户洒进来
【角色】林悦走进咖啡馆，看着窗外的雨景
【台词】林悦：今天天气真好呀...

也可以直接写叙事内容，AI 会自动分析分镜。`}
rows={14}
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* 字数统计 */}
                <div className="flex items-center justify-between text-base">
                  <span className="text-zinc-500">字数: <span className="text-white font-medium">{script.length}</span></span>
                  <span className={script.length < 50 ? 'text-orange-400' : 'text-emerald-400'}>
                    {script.length < 50 ? '建议输入更多内容以获得更好的效果' : '✓ 内容充足，可以开始创作'}
                  </span>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-5 pt-4">
                  <motion.button 
                    onClick={() => setStep(1)} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-5 text-lg font-semibold bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all"
                  >
                    上一歩
                  </motion.button>
                  <motion.button 
                    onClick={handleCreate} 
                    disabled={loading || !title.trim() || !script.trim()}
                    whileHover={{ scale: !loading && title.trim() && script.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: !loading && title.trim() && script.trim() ? 0.98 : 1 }}
                    className="flex-1 flex items-center justify-center gap-3 py-5 text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-black rounded-2xl shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        创作中..
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-6 h-6" />
                        开始创作
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
