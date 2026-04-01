const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db.cjs')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'ai-comic-secret-key-2024'

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }
    
    // 检查用户是否存在
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return res.status(400).json({ error: '该邮箱已注册' })
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 创建用户，新用户赠送500积分
    const result = db.prepare(
      'INSERT INTO users (email, password, nickname, points) VALUES (?, ?, ?, 500)'
    ).run(email, hashedPassword, nickname || email.split('@')[0])
    
    // 记录积分来源
    db.prepare(`
      INSERT INTO point_transactions (user_id, type, amount, balance, description)
      VALUES (?, 'earn', 500, 500, '新用户注册奖励')
    `).run(result.lastInsertRowid)
    
    const user = db.prepare('SELECT id, email, nickname, created_at FROM users WHERE id = ?').get(result.lastInsertRowid)
    
    // 生成token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    
    res.json({ user, token })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }
    
    // 查找用户
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }
    
    // 生成token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    
    const { password: _, ...userInfo } = user
    res.json({ user: userInfo, token })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 获取当前用户信息
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未登录' })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = db.prepare('SELECT id, email, nickname, created_at FROM users WHERE id = ?').get(decoded.userId)
    
    if (!user) {
      return res.status(401).json({ error: '用户不存在' })
    }
    
    res.json({ user })
  } catch (error) {
    return res.status(401).json({ error: 'token无效' })
  }
})

module.exports = router
