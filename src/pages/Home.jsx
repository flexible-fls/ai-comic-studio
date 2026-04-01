import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Wand2, Users, Layers, Video, Play } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* 导航 */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#000" />
            </div>
            <span style={{ fontWeight: '600' }}>FULUSHOU</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/login" style={{ fontSize: '14px', color: '#a1a1aa', textDecoration: 'none' }}>登录</Link>
            <Link to="/login" style={{ fontSize: '14px', padding: '8px 16px', backgroundColor: '#10b981', color: '#000', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>开始使用</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
          <span style={{ color: '#fff' }}>一份剧本，</span>
          <span style={{ color: '#10b981' }}>生成精彩漫剧</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#71717a', marginBottom: '32px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
          从剧本到视频，一站式 AI 智能创作
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/login" style={{ padding: '12px 24px', backgroundColor: '#10b981', color: '#000', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            免费开始 <ArrowRight size={18} />
          </Link>
          <button style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backgroundColor: 'transparent', color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Play size={18} /> 观看演示
          </button>
        </div>
      </section>

      {/* 功能 */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }}>核心功能</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { icon: Wand2, title: 'AI 智能生成', desc: '自动生成精美分镜' },
            { icon: Users, title: '角色一致性', desc: '保持角色外观统一' },
            { icon: Layers, title: '智能分镜', desc: '专业级镜头语言' },
            { icon: Video, title: '视频生成', desc: '支持4K高清输出' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
              <item.icon size={32} color="#10b981" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#a1a1aa' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 步骤 */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }}>使用流程</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
          {['输入剧本', 'AI分析', '生成图片', '语音合成', '口型同步', '视频输出'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#18181b', border: '1px solid #27272a', fontSize: '14px' }}>
                <span style={{ color: '#10b981', marginRight: '4px' }}>{i + 1}.</span>
                {step}
              </div>
              {i < 5 && <span style={{ margin: '0 8px', color: '#52525b' }}>→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* 数据 */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {[
            { value: '50K+', label: '用户' },
            { value: '100K+', label: '作品' },
            { value: '4.9', label: '评分' },
            { value: '99.9%', label: '可用性' },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{item.value}</div>
              <div style={{ fontSize: '14px', color: '#71717a' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>准备好开始了吗？</h2>
        <p style={{ fontSize: '16px', color: '#71717a', marginBottom: '24px' }}>加入 50,000+ 创作者</p>
        <Link to="/login" style={{ display: 'inline-block', padding: '16px 32px', backgroundColor: '#fff', color: '#000', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' }}>
          免费开始使用
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #27272a', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '14px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={12} color="#000" />
          </div>
          <span>FULUSHOU</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  )
}
