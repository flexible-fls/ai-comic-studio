import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Eye, EyeOff, User, Mail, Lock, Play } from 'lucide-react'
import useStore from '../store/useStore'

const API_URL = '/api'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const body = isLogin ? { email, password } : { email, password, nickname: name }
      const res = await fetch(`${API_URL}${endpoint}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '操作失败')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    finally { setLoading(false) }
  }

  // 演示模式登录
  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo_user',
      email: 'demo@ai-comic.studio',
      nickname: '演示用户',
      points: 99999,
      membership: 'pro'
    }
    localStorage.setItem('token', 'demo_token')
    localStorage.setItem('user', JSON.stringify(demoUser))
    setUser(demoUser)
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#10b981' }}>
            <Sparkles size={24} color="#000" />
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginTop: '16px' }}>FULUSHOU</h1>
          <p style={{ fontSize: '14px', color: '#71717a', marginTop: '4px' }}>AI 漫剧创作平台</p>
        </div>

        {/* 演示模式提示 */}
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#10b981', textAlign: 'center' }}>
            后端服务暂不可用，请使用演示模式体验
          </p>
        </div>

        {/* 演示登录按钮 */}
        <button 
          onClick={handleDemoLogin}
          style={{ 
            width: '100%', 
            padding: '14px', 
            marginBottom: '16px',
            backgroundColor: 'transparent', 
            color: '#10b981', 
            borderRadius: '8px', 
            fontSize: '14px', 
            fontWeight: '600', 
            border: '1px solid #10b981', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.backgroundColor = 'rgba(16,185,129,0.1)' }}
          onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent' }}
        >
          <Play size={16} />
          演示模式登录
        </button>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#27272a' }}></div>
          <span style={{ padding: '0 12px', fontSize: '12px', color: '#71717a' }}>或</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#27272a' }}></div>
        </div>

        {/* 表单 */}
        <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
          {/* Tab */}
          <div style={{ display: 'flex', padding: '4px', backgroundColor: '#27272a', borderRadius: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer', backgroundColor: isLogin ? '#fff' : 'transparent', color: isLogin ? '#000' : '#a1a1aa' }}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer', backgroundColor: !isLogin ? '#fff' : 'transparent', color: !isLogin ? '#000' : '#a1a1aa' }}
            >
              注册
            </button>
          </div>


          {/* 错误 */}
          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </div>

          )}

<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>昵称</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="输入昵称"
                    style={{ width: '100%', padding: '10px 12px 10px 40px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>

              </div>

            )}


            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>邮箱</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your@email.com"
                  required 
                  style={{ width: '100%', padding: '10px 12px 10px 40px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

            </div>


            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>密码</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="输入密码"
                  required 
                  style={{ width: '100%', padding: '10px 40px 10px 40px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

              </div>
            </div>


            <button 
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: '8px', backgroundColor: '#10b981', color: '#000', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? (
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>{isLogin ? '登录' : '注册'}<ArrowRight size={16} /></>
              )}

            </button>

          </form>
        </div>


        <p style={{ textAlign: 'center', fontSize: '12px', color: '#71717a', marginTop: '24px' }}>
          登录即同意 <span style={{ color: '#10b981' }}>服务条款</span> 和 <span style={{ color: '#10b981' }}>隐私政策</span>
        </p>

      </div>

    </div>

  )
}
