const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const db = require('../db.cjs')
const ai = require('../ai.cjs')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'ai-comic-secret-key-2024'

// 中间件：验证token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未登录' })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ error: 'token无效' })
  }
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 获取用户所有项目
router.get('/', authenticate, (req, res) => {
  try {
    const projects = db.prepare(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC'
    ).all(req.userId)
    
    const formattedProjects = projects.map(p => ({
      ...p,
      storyboard: p.storyboard ? JSON.parse(p.storyboard) : [],
      steps: {
        script: !!p.script,
        storyboard: !!p.storyboard,
        image: p.status === 'completed' || p.status === 'processing',
        video: p.status === 'completed'
      }
    }))
    
    res.json({ projects: formattedProjects })
  } catch (error) {
    console.error('获取项目错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 创建新项目
router.post('/', authenticate, (req, res) => {
  try {
    const { title, script, style, storyboard } = req.body
    
    const id = generateId()
    const cover = `https://picsum.photos/seed/${id}/400/300`
    
    db.prepare(`
      INSERT INTO projects (id, user_id, title, script, style, storyboard, cover, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.userId, title || '未命名项目', script || '', style || '2d_jp', 
           storyboard ? JSON.stringify(storyboard) : null, cover, 'draft')
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id)
    
    res.json({ 
      project: {
        ...project,
        storyboard: storyboard || [],
        steps: { script: !!script, storyboard: !!storyboard, image: false, video: false }
      }
    })
  } catch (error) {
    console.error('创建项目错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 获取单个项目
router.get('/:id', authenticate, (req, res) => {
  try {
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    res.json({ 
      project: {
        ...project,
        storyboard: project.storyboard ? JSON.parse(project.storyboard) : []
      }
    })
  } catch (error) {
    console.error('获取项目错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 更新项目
router.put('/:id', authenticate, (req, res) => {
  try {
    const { title, script, style, storyboard, cover, status } = req.body
    
    const existing = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!existing) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    db.prepare(`
      UPDATE projects 
      SET title = ?, script = ?, style = ?, storyboard = ?, cover = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(
      title ?? existing.title,
      script ?? existing.script,
      style ?? existing.style,
      storyboard ? JSON.stringify(storyboard) : existing.storyboard,
      cover ?? existing.cover,
      status ?? existing.status,
      req.params.id,
      req.userId
    )
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id)
    
    res.json({ 
      project: {
        ...project,
        storyboard: project.storyboard ? JSON.parse(project.storyboard) : []
      }
    })
  } catch (error) {
    console.error('更新项目错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 删除项目
router.delete('/:id', authenticate, (req, res) => {
  try {
    const result = db.prepare(
      'DELETE FROM projects WHERE id = ? AND user_id = ?'
    ).run(req.params.id, req.userId)
    
    if (result.changes === 0) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    res.json({ success: true })
  } catch (error) {
    console.error('删除项目错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ========== AI 相关接口 ==========

// 精准分析剧本 - 提取角色、场景、道具
router.post('/:id/analyze-script', authenticate, async (req, res) => {
  try {
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    const { script, style } = req.body
    const scriptText = script || project.script
    
    if (!scriptText) {
      return res.status(400).json({ error: '剧本内容不能为空' })
    }
    
    // 使用DeepSeek精准分析剧本
    const analysis = await ai.analyzeScript(scriptText, style || project.style)
    
    // 更新项目
    db.prepare(`
      UPDATE projects SET script = ?, characters = ?, scenes = ?, props = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(
      scriptText,
      JSON.stringify(analysis.characters || []),
      JSON.stringify(analysis.scenes || []),
      JSON.stringify(analysis.props || []),
      req.params.id
    )
    
    res.json({
      characters: analysis.characters || [],
      scenes: analysis.scenes || [],
      props: analysis.props || []
    })
  } catch (error) {
    console.error('分析剧本错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// 生成分镜
router.post('/:id/storyboard', authenticate, async (req, res) => {
  try {
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    const { script, style } = req.body
    
    // 使用AI生成分镜
    const storyboard = await ai.generateStoryboard(script || project.script, style || project.style)
    
    // 更新项目
    db.prepare(`
      UPDATE projects SET storyboard = ?, style = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(JSON.stringify(storyboard), style || project.style, req.params.id)
    
    res.json({ storyboard })
  } catch (error) {
    console.error('生成分镜错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// 生成配音与口型同步视频（完整流程）
router.post('/:id/lipsync', authenticate, async (req, res) => {
  try {
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    const { shots } = req.body
    
    if (!shots || !Array.isArray(shots)) {
      return res.status(400).json({ error: '分镜数据不能为空' })
    }
    
    // 为每个有台词的分镜生成完整的配音视频
    // 完整流程：文本 → TTS配音 → 口型同步 → 视频
    const results = []
    for (let i = 0; i < shots.length; i++) {
      const shot = shots[i]
      if (shot.dialogue && shot.image) {
        // 使用完整流程：TTS + 口型同步
        const result = await ai.generateLipSyncVideo({
          image: shot.image,
          dialogue: shot.dialogue
        })
        
        if (result.success) {
          results.push({
            shotIndex: i,
            dialogue: result.dialogue,
            audioUrl: result.audioUrl,
            videoUrl: result.videoUrl,
            duration: result.duration,
            lipSync: result.lipSync,
            audioMatch: result.audioMatch,
            method: result.method
          })
        }
      }
    }
    
    res.json({ 
      success: true,
      videos: results,
      total: results.length,
      info: '完整流程：TTS配音 → Wav2Lip口型同步 → 视频'
    })
  } catch (error) {
    console.error('生成配音错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// 生成单个图片
router.post('/:id/generate-image', authenticate, async (req, res) => {
  try {
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    const { prompt, index } = req.body
    const style = project.style || '2d_jp'
    
    // 生成图片 - 使用prompt
    const result = await ai.generateImage(prompt || 'anime style', style, req.userId)
    
    if (result.success && result.imageUrl) {
      // 直接使用返回的图片URL
      const imageUrl = result.imageUrl
      
      // 更新分镜数据
      const storyboard = project.storyboard ? JSON.parse(project.storyboard) : []
      if (index !== undefined && storyboard[index]) {
        storyboard[index].image = imageUrl
        storyboard[index].status = 'completed'
        db.prepare('UPDATE projects SET storyboard = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(JSON.stringify(storyboard), req.params.id)
      }
      
      return res.json({ success: true, imageUrl })
    } else if (result.mockUrl) {
      // 返回模拟图片
      return res.json({ success: true, imageUrl: result.mockUrl })
    }
    
    // 返回模拟/错误结果
    res.json(result)
  } catch (error) {
    console.error('生成图片错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// 批量生成图片
router.post('/:id/generate-images', authenticate, async (req, res) => {
  try {
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    const storyboard = project.storyboard ? JSON.parse(project.storyboard) : []
    const results = []
    
    for (let i = 0; i < storyboard.length; i++) {
      const shot = storyboard[i]
      // 使用场景描述作为prompt
      const prompt = shot.description || shot.scene || 'anime style'
      const result = await ai.generateImage(prompt, project.style, req.userId)
      
      if (result.success && result.imageUrl) {
        shot.image = result.imageUrl
        shot.status = 'completed'
        results.push({ index: i, success: true, imageUrl: result.imageUrl })
      } else if (result.mockUrl) {
        shot.image = result.mockUrl
        shot.status = 'completed'
        results.push({ index: i, success: true, imageUrl: result.mockUrl })
      } else {
        // 使用基于prompt的模拟图片
        shot.image = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologin=true`
        shot.status = 'completed'
        results.push({ index: i, success: true, imageUrl: shot.image })
      }
    }
    
    // 更新项目状态
    db.prepare(`
      UPDATE projects SET storyboard = ?, status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(JSON.stringify(storyboard), req.params.id)
    
    res.json({ results, storyboard })
  } catch (error) {
    console.error('批量生成图片错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// 生成视频
router.post('/:id/generate-video', authenticate, async (req, res) => {
  try {
    const project = db.prepare(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId)
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' })
    }
    
    const storyboard = project.storyboard ? JSON.parse(project.storyboard) : []
    const images = storyboard.map(s => s.image).filter(Boolean)
    
    if (images.length === 0) {
      return res.status(400).json({ error: '没有可用的图片' })
    }
    
    // 生成视频
    const result = await ai.generateVideo(images)
    
    if (result.success) {
      db.prepare(`
        UPDATE projects SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(req.params.id)
    }
    
    res.json(result)
  } catch (error) {
    console.error('生成视频错误:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
