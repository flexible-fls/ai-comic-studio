import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Sparkles, Zap, LogOut, Gift, Crown, 
  Palette, Film, Heart, Star, TrendingUp, Clock,
  Play, ArrowRight, Sparkle, Users, Flame,
  Coins, Shield, Check,
  User, Settings, Eye, MoreVertical,
  ChevronRight, Wand2,
  Bell
} from 'lucide-react'

const SparkleIcon = Sparkle
const SparkleIcon2 = Sparkle
const CreditCardIcon = Coins
const CrownIcon = Crown

const API_URL = '/api'

const packages = [
  { id: 1, name: 'Starter', points: 100, price: 9, original: 19, tag: '热销', gradient: 'from-blue-500 to-cyan-400', icon: Coins },
  { id: 2, name: 'Plus', points: 500, price: 39, original: 79, tag: '超值', gradient: 'from-purple-500 to-violet-400', icon: SparkleIcon2 },
  { id: 3, name: 'Pro', points: 1000, price: 69, original: 139, tag: '推荐', gradient: 'from-emerald-500 to-teal-400', icon: TrendingUp },
  { id: 4, name: 'Enterprise', points: 5000, price: 299, original: 599, tag: '', gradient: 'from-orange-500 to-amber-400', icon: CrownIcon },
]

const hotWorks = [
  { id: 1, title: '星际恋人', author: '星河', cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=200&fit=crop', likes: 2345 },
  { id: 2, title: '龙族觉醒', author: '龙魂', cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=200&fit=crop', likes: 1892 },
  { id: 3, title: '都市传说', author: '夜影', cover: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300&h=200&fit=crop', likes: 1654 },
  { id: 4, title: '仙侠奇缘', author: '云天', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=200&fit=crop', likes: 1432 },
]

const quickActions = [
  { id: 'new', icon: Plus, label: '新建项目', desc: '开始创作', gradient: 'from-emerald-500 to-cyan-500', path: '/workflow/new' },
  { id: 'sign', icon: Gift, label: '每日签到', desc: '领取积分', gradient: 'from-pink-500 to-rose-500', path: null },
  { id: 'vip', icon: CrownIcon, label: '开通会员', desc: '解锁特权', gradient: 'from-amber-500 to-orange-500', path: null },
  { id: 'style', icon: Palette, label: '风格市场', desc: '探索更多', gradient: 'from-violet-500 to-purple-500', path: null },
]

const tabs = [
  { id: 'projects', label: '我的作品', icon: Film },
  { id: 'recharge', label: '充值积分', icon: Coins },
  { id: 'member', label: '会员中心', icon: CrownIcon },
  { id: 'settings', label: '设置', icon: Settings },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { projects, setProjects, setUser } = useStore()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')
  const userPoints = 440
  const userName = '领导'
  const userLevel = 'Pro'
  const memberSince = '2026-03'

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      setLoading(true)
      try {
        const res = await fetch(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        if (data.projects) setProjects(data.projects)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchProjects()
  }, [setProjects])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })

  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalViews: 1234,
    totalLikes: 567
  }

  const getProjectProgress = (project) => {
    let progress = 0
    if (project.script) progress += 20
    if (project.characters?.length > 0) progress += 20
    if (project.shots?.some(s => s.image)) progress += 30
    if (project.shots?.some(s => s.dialogueAudio)) progress += 30
    return progress
  }

  return (
    <div className="min-h-screen bg-[#030308] relative overflow-hidden">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-[120px]" />
      </div>
      <div className="grid-bg opacity-30" />

      {/* 头部 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <nav className=" backdrop-blur-2xl bg-black/40 border border-white/[0.08] rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <span className="text-lg font-bold tracking-tight">FULUSHOU</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/20">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">{userPoints.toLocaleString()}</span>
                  <span className="text-zinc-500 text-sm">积分</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* 欢迎横幅 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-violet-500/20" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            
            <div className="relative p-10 md:p-14">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 flex items-center justify-center text-3xl font-black text-black shadow-2xl shadow-emerald-500/30"
                  >
                    {userName[0]}
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-black text-white">{userName}</h1>
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold flex items-center gap-2">
                        <CrownIcon className="w-4 h-4" />
                        {userLevel}会员
                      </span>
                    </div>
                    <p className="text-zinc-500 mb-4">加入于 {memberSince} · 积累创作灵感</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Film className="w-5 h-5 text-emerald-400" />
                        <span className="text-zinc-400">{stats.totalProjects} 作品</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-violet-400" />
                        <span className="text-zinc-400">{stats.totalViews} 浏览</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-400" />
                        <span className="text-zinc-400">{stats.totalLikes} 点赞</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-xl">
                    <Zap className="w-6 h-6 text-emerald-400" />
                    <span className="text-2xl font-black text-emerald-400">{userPoints}</span>
                    <span className="text-zinc-400">积分</span>
                  </div>
                  <motion.button 
                    onClick={() => navigate('/workflow/new')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-2xl shadow-xl shadow-emerald-500/30"
                  >
                    <Plus className="w-6 h-6" />
                    新建项目
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 快捷操作 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {action.path ? (
                    <Link
                      to={action.path}
                      className={`group relative flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="relative">
                        <p className="font-bold text-white">{action.label}</p>
                        <p className="text-sm text-zinc-500">{action.desc}</p>
                      </div>
                    </Link>
                  ) : (
                    <button
                      className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all w-full overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="relative text-left">
                        <p className="font-bold text-white">{action.label}</p>
                        <p className="text-sm text-zinc-500">{action.desc}</p>
                      </div>
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              {/* 标签页 */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all
                        ${activeTab === tab.id 
                          ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-xl shadow-emerald-500/30' 
                          : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </motion.button>
                  )
                })}
              </div>

              {/* 内容区域 */}
              <AnimatePresence mode="wait">
                {activeTab === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Film className="w-7 h-7 text-emerald-400" />
                        我的作品
                      </h2>
                      <span className="text-zinc-500">{projects.length} 个项目</span>
                    </div>
                    
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                      </div>
                    ) : projects.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-16 text-center"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                            <SparkleIcon2 className="w-12 h-12 text-emerald-400" />
                          </div>
                          <p className="text-xl text-zinc-400 mb-6">还没有任何作品</p>
                          <motion.button 
                            onClick={() => navigate('/workflow/new')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-2xl shadow-xl shadow-emerald-500/30"
                          >
                            <Wand2 className="w-6 h-6" />
                            创建第一个项目
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project, i) => {
                          const progress = getProjectProgress(project)
                          return (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              whileHover={{ y: -4 }}
                              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                              onClick={() => navigate(`/workflow/${project.id}`)}
                            >
                              <div className="aspect-video overflow-hidden relative">
                                {project.cover || project.shots?.[0]?.image ? (
                                  <img src={project.cover || project.shots[0].image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-emerald-500/20 flex items-center justify-center">
                                    <Film className="w-16 h-16 text-white/20" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                  <span className={`px-3 py-1.5 rounded-xl text-sm font-bold backdrop-blur-xl ${
                                    project.status === 'completed' ? 'bg-emerald-500/80 text-white' :
                                    project.status === 'processing' ? 'bg-amber-500/80 text-white' :
                                    'bg-white/20 text-white'
                                  }`}>
                                    {project.status === 'completed' ? '已完成' : project.status === 'processing' ? '处理中' : '待处理'}
                                  </span>
                                  {progress > 0 && (
                                    <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl text-sm text-emerald-400 font-bold">
                                      {progress}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="p-5">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="font-bold text-xl text-white leading-tight">{project.title}</h3>
                                  <button className="p-2 rounded-xl hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                </div>
                                <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{project.script?.substring(0, 80)}...</p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-zinc-600">{formatDate(project.createdAt)}</span>
                                  <span className="flex items-center gap-2 text-zinc-500">
                                    <Eye className="w-4 h-4" /> {Math.floor(Math.random() * 500)}
                                    <Heart className="w-4 h-4 ml-2" /> {Math.floor(Math.random() * 200)}
                                  </span>
                                </div>
                                {progress > 0 && progress < 100 && (
                                  <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progress}%` }}
                                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                                    />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'recharge' && (
                  <motion.div
                    key="recharge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Coins className="w-7 h-7 text-emerald-400" />
                      充值积分
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {packages.map((pkg, i) => {
                        const Icon = pkg.icon
                        return (
                          <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:border-emerald-500/30 transition-all p-8"
                          >
                            {pkg.tag && (
                              <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-sm font-bold shadow-lg">
                                {pkg.tag}
                              </div>
                            )}
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                            <div className="flex items-baseline gap-3 mb-4">
                              <span className="text-4xl font-black text-emerald-400">¥{pkg.price}</span>
                              <span className="text-lg text-zinc-600 line-through">¥{pkg.original}</span>
                            </div>
                            <div className="text-lg text-zinc-400 mb-6">{pkg.points.toLocaleString()} 积分</div>
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full py-4 rounded-2xl font-bold bg-gradient-to-r ${pkg.gradient} text-white shadow-lg`}
                            >
                              立即购买
                            </motion.button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'member' && (
                  <motion.div
                    key="member"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="relative overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-500/5" />
                      <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/20 rounded-full blur-[100px]" />
                      <div className="relative p-10 md:p-14">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                          <div>
                            <div className="flex items-center gap-4 mb-3">
                              <CrownIcon className="w-12 h-12 text-amber-400" />
                              <span className="text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{userLevel} 会员</span>
                            </div>
                            <p className="text-zinc-500 mb-6 text-lg">有效期至 2026年12月31日</p>
                            <div className="flex flex-wrap items-center gap-6">
                              <span className="flex items-center gap-2 text-emerald-400 font-medium"><Check className="w-5 h-5" /> 无限生成</span>
                              <span className="flex items-center gap-2 text-emerald-400 font-medium"><Check className="w-5 h-5" /> 1080P+</span>
                              <span className="flex items-center gap-2 text-emerald-400 font-medium"><Check className="w-5 h-5" /> 商业授权</span>
                            </div>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-black font-bold shadow-xl shadow-amber-500/30"
                          >
                            续费会员
                          </motion.button>
                        </div>
                      </div>
                    </div>
                      
                    <h3 className="text-2xl font-bold text-white">会员特权</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { icon: Zap, title: '无限生成', desc: '不限次数 AI 生成', gradient: 'from-emerald-500 to-teal-500' },
                        { icon: Film, title: '高清画质', desc: '最高 4K 分辨率', gradient: 'from-violet-500 to-purple-500' },
                        { icon: Shield, title: '商业授权', desc: '可商用无限制', gradient: 'from-amber-500 to-orange-500' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                        >
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                            <item.icon className="w-7 h-7 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-zinc-500">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Settings className="w-7 h-7 text-emerald-400" />
                      设置
                    </h2>
                    <div className="space-y-4">
                      {[
                        { icon: User, label: '个人资料', desc: '修改昵称、头像', gradient: 'from-emerald-500 to-cyan-500' },
                        { icon: Shield, title: '账号安全', desc: '密码、绑定手机', gradient: 'from-violet-500 to-purple-500' },
                        { icon: Bell, title: '通知设置', desc: '推送通知配置', gradient: 'from-amber-500 to-orange-500' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                              <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{item.label || item.title}</h4>
                              <p className="text-zinc-500">{item.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 侧边栏 - 热门作品 */}
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400" />
                热门作品
              </h3>
              <div className="space-y-4">
                {hotWorks.map((work, i) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all cursor-pointer group"
                  >
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-sm font-black text-white shadow-lg">
                      {i + 1}
                    </span>
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-lg">
                      <img src={work.cover} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white truncate">{work.title}</h4>
                      <p className="text-sm text-zinc-500">by {work.author}</p>
                    </div>
                    <Heart className="w-4 h-4 text-pink-500 shrink-0" />
                  </motion.div>
                ))}
              </div>

              {/* 创作统计 */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10">
                <h4 className="font-bold text-white mb-5 flex items-center gap-2">
                  <TrendUp className="w-5 h-5 text-emerald-400" />
                  创作数据
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">本周作品</span>
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">总浏览量</span>
                    <span className="text-white font-bold">2,345</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">获赞数</span>
                    <span className="text-white font-bold">1,234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
