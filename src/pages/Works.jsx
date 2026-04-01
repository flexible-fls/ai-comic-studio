import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, ArrowRight, Play, Menu, X, 
  Heart, Filter, Search, Grid, List, TrendingUp, Clock,
  Eye, Sparkle
} from 'lucide-react'

const allWorks = [
  { id: 1, title: '星际恋人', author: '星河', cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop', likes: 2345, views: 12345, tags: ['恋爱', '科幻'], duration: '3:25' },
  { id: 2, title: '龙族觉醒', author: '龙魂', cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=600&fit=crop', likes: 1892, views: 9876, tags: ['热血', '战斗'], duration: '4:12' },
  { id: 3, title: '都市传说', author: '夜影', cover: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=600&fit=crop', likes: 1654, views: 8765, tags: ['悬疑', '都市'], duration: '2:58' },
  { id: 4, title: '仙侠奇缘', author: '云天', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', likes: 1432, views: 7654, tags: ['仙侠', '奇幻'], duration: '5:03' },
  { id: 5, title: '重生千金', author: '凤舞', cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop', likes: 1201, views: 6543, tags: ['重生', '都市'], duration: '3:45' },
  { id: 6, title: '末世危机', author: '铁血', cover: 'https://images.unsplash.com/photo-1504198458649-3128b932f699?w=400&h=600&fit=crop', likes: 987, views: 5432, tags: ['末世', '生存'], duration: '4:30' },
  { id: 7, title: '校园日常', author: '阳光', cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop', likes: 876, views: 4321, tags: ['校园', '日常'], duration: '2:15' },
  { id: 8, title: '魔法学园', author: '星辰', cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', likes: 765, views: 3210, tags: ['魔法', '学园'], duration: '3:58' },
  { id: 9, title: '古墓探险', author: '摸金', cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop', likes: 654, views: 2109, tags: ['冒险', '悬疑'], duration: '4:22' },
]

const categories = ['全部', '恋爱', '热血', '仙侠', '科幻', '悬疑', '都市', '校园', '冒险']
const sorts = [
  { id: 'hot', label: '热门', icon: TrendingUp },
  { id: 'new', label: '最新', icon: Clock },
  { id: 'like', label: '点赞', icon: Heart },
]

export default function Works() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [category, setCategory] = useState('全部')
  const [sort, setSort] = useState('hot')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  const filteredWorks = allWorks.filter(work => {
    const matchCategory = category === '全部' || work.tags.includes(category)
    const matchSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        work.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen">
      <div className="grid-bg" />
      
      {/* 导航 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[rgba(3,3,8,0.9)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.06)]' : ''}`}>
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e5c4] to-[#00c4b0] flex items-center justify-center shadow-[0_0_24px_rgba(0,229,196,0.4)] group-hover:shadow-[0_0_40px_rgba(0,229,196,0.5)] transition-all duration-300">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg tracking-wide font-['Space_Grotesk']">FULUSHOU</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setShowLogin(true)} className="btn-primary">
              立即开始
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-3 bg-[#030308]/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)]">
            <button onClick={() => setShowLogin(true)} className="btn-primary w-full py-3">
              立即开始
            </button>
          </div>
        )}
      </nav>

      {/* 主体 */}
      <main className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk']">
              作品展示
            </h1>
            <p className="text-[#6b6b80] text-lg">发现灵感，邂逅佳作</p>
          </div>

          {/* 筛选条 */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            {/* 分类标签 */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat 
                      ? 'bg-[#00e5c4] text-black' 
                      : 'bg-[#0a0a1a] border border-[rgba(255,255,255,0.08)] text-[#6b6b80] hover:border-[rgba(255,255,255,0.15)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* 搜索 */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索作品..."
                  className="input-field pl-11 w-48"
                />
              </div>

              {/* 排序 */}
              <div className="flex gap-2">
                {sorts.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      sort === s.id 
                        ? 'bg-[rgba(0,229,196,0.1)] text-[#00e5c4] border border-[rgba(0,229,196,0.2)]'
                        : 'text-[#6b6b80] hover:text-white'
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    {s.label}
                  </button>
                ))}
              </div>

              {/* 视图切换 */}
              <div className="flex gap-1 p-1 bg-[#0a0a1a] rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#00e5c4]/20 text-[#00e5c4]' : 'text-[#6b6b80]'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#00e5c4]/20 text-[#00e5c4]' : 'text-[#6b6b80]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 作品网格 */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredWorks.map(work => (
              <div
                key={work.id}
                className="group relative overflow-hidden rounded-2xl bg-[#0a0a1a]/50 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,229,196,0.3)] transition-all hover:shadow-xl hover:shadow-[rgba(0,229,196,0.1)]"
                onMouseEnter={() => setHoveredCard(work.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* 网格视图 */}
                    <div className="aspect-[2/3] overflow-hidden">
                      <img 
                        src={work.cover} 
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    
                    {/* 悬浮信息 */}
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${hoveredCard === work.id ? 'opacity-100' : 'opacity-0'}`}>
                      <button className="btn-primary px-8 py-3 text-lg">
                        <Play className="w-5 h-5 mr-2" />
                        立即观看
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg mb-1">{work.title}</h3>
                      <p className="text-sm text-[#6b6b80] mb-3">by {work.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-[#6b6b80]">
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {work.likes}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {work.views}</span>
                        </div>
                        <span className="px-2 py-1 bg-black/50 rounded text-xs">{work.duration}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* 列表视图 */
                  <div className="flex p-4 gap-4">
                    <div className="w-32 h-20 rounded-lg overflow-hidden shrink-0">
                      <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1">{work.title}</h3>
                      <p className="text-sm text-[#6b6b80] mb-2">by {work.author}</p>
                      <div className="flex items-center gap-4 text-xs text-[#6b6b80]">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {work.likes}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {work.views}</span>
                        <span>{work.duration}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredWorks.length === 0 && (
            <div className="text-center py-20">
              <Sparkle className="w-12 h-12 mx-auto mb-4 text-[#404055]" />
              <p className="text-[#6b6b80]">暂无作品</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}