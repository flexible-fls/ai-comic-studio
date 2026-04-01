import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, FolderOpen, Plus, LogOut, Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/works', label: '作品展示', icon: FolderOpen },
    { path: '/dashboard', label: '控制台', icon: FolderOpen, private: true },
    { path: '/workflow/new', label: '新建项目', icon: Plus, private: true },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 h-18 bg-[rgba(3,3,8,0.85)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e5c4] to-[#00c4b0] flex items-center justify-center shadow-[0_0_24px_rgba(0,229,196,0.4)] group-hover:shadow-[0_0_40px_rgba(0,229,196,0.5)] transition-all duration-300">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg tracking-wide font-['Space_Grotesk']">FULUSHOU</span>
          </Link>
          
          {/* 导航 - 桌面端 */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(item => {
              if (item.private && !isLoggedIn) return null
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.path) 
                      ? 'bg-[rgba(0,229,196,0.15)] text-[#00e5c4] border border-[rgba(0,229,196,0.2)]' 
                      : 'text-[#6b6b80] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* 右侧 */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[rgba(0,229,196,0.1)] border border-[rgba(0,229,196,0.2)]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00e5c4] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-black">
                    {user?.nickname?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <span className="text-sm text-[#00e5c4] font-medium">{user?.nickname || '用户'}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#6b6b80] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  退出
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:inline-flex btn-primary px-6 py-2.5 text-sm font-medium">
                立即开始
              </Link>
            )}
            
            {/* 移动端菜单按钮 */}
            <button 
              className="md:hidden p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      {menuOpen && (
        <div className="fixed top-18 left-0 right-0 z-40 bg-[rgba(3,3,8,0.98)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] md:hidden">
          <nav className="container py-4 space-y-2">
            {navItems.map(item => {
              if (item.private && !isLoggedIn) return null
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all ${
                    isActive(item.path) 
                      ? 'bg-[rgba(0,229,196,0.15)] text-[#00e5c4]' 
                      : 'text-[#a0a0b8]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00e5c4] text-black font-medium"
              >
                立即开始
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* 主内容 */}
      <main className="flex-1 pt-18">
        <Outlet />
      </main>
    </div>
  )
}