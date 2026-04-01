/**
 * 积分与订单管理
 */
const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../db.cjs')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'ai-comic-secret-key-2024'

// 中间件：验证用户
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '请先登录' })
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (e) {
    res.status(401).json({ error: 'token无效' })
  }
}

// ===== 积分相关 =====

// 获取用户积分
router.get('/points', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT points, membership, membership_expire FROM users WHERE id = ?').get(req.userId)
    if (!user) return res.status(404).json({ error: '用户不存在' })
    
    res.json({
      points: user.points,
      membership: user.membership,
      membershipExpire: user.membership_expire
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 获取积分记录
router.get('/points/logs', auth, (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT * FROM point_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all(req.userId)
    
    res.json({ logs })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 扣除积分（生成作品时调用）
router.post('/points/deduct', auth, (req, res) => {
  const { amount, description, projectId } = req.body
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: '积分数量无效' })
  }
  
  try {
    const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.userId)
    if (!user || user.points < amount) {
      return res.status(400).json({ error: '积分不足' })
    }
    
    // 扣除积分
    db.prepare('UPDATE users SET points = points - ? WHERE id = ?').run(amount, req.userId)
    
    // 记录
    db.prepare(`
      INSERT INTO point_transactions (user_id, type, amount, balance, description, related_id)
      VALUES (?, 'spend', ?, ?, ?, ?)
    `).run(req.userId, amount, user.points - amount, description || '消费', projectId)
    
    const newUser = db.prepare('SELECT points FROM users WHERE id = ?').get(req.userId)
    res.json({ success: true, points: newUser.points })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 赠送积分（新用户注册、签到等）
router.post('/points/earn', auth, (req, res) => {
  const { amount, description, source } = req.body
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: '积分数量无效' })
  }
  
  try {
    const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.userId)
    
    // 增加积分
    db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(amount, req.userId)
    
    // 记录
    db.prepare(`
      INSERT INTO point_transactions (user_id, type, amount, balance, description, related_id)
      VALUES (?, 'earn', ?, ?, ?, ?)
    `).run(req.userId, amount, user.points + amount, description || '获得积分', source)
    
    const newUser = db.prepare('SELECT points FROM users WHERE id = ?').get(req.userId)
    res.json({ success: true, points: newUser.points })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ===== 充值套餐 =====

// 获取充值套餐列表
router.get('/packages', (req, res) => {
  try {
    const packages = db.prepare(`
      SELECT * FROM packages ORDER BY sort_order ASC
    `).all()
    res.json({ packages })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ===== 订单相关 =====

// 创建订单
router.post('/orders', auth, (req, res) => {
  const { packageId } = req.body
  
  try {
    const pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(packageId)
    if (!pkg) {
      return res.status(400).json({ error: '套餐不存在' })
    }
    
    // 生成订单号
    const orderNo = `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // 创建订单
    db.prepare(`
      INSERT INTO orders (user_id, order_no, package_id, package_name, points, amount, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).run(req.userId, orderNo, pkg.id, pkg.name, pkg.points, pkg.price)
    
    res.json({
      success: true,
      order: { orderNo, points: pkg.points, amount: pkg.price }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 模拟支付成功（演示用）
router.post('/orders/:orderNo/pay', auth, (req, res) => {
  const { orderNo } = req.params
  const { paymentMethod = 'wechat' } = req.body
  
  try {
    const order = db.prepare('SELECT * FROM orders WHERE order_no = ? AND user_id = ?').get(orderNo, req.userId)
    if (!order) {
      return res.status(404).json({ error: '订单不存在' })
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ error: '订单状态异常' })
    }
    
    // 更新订单状态
    db.prepare(`
      UPDATE orders SET status = 'paid', payment_method = ?, paid_at = CURRENT_TIMESTAMP
      WHERE order_no = ?
    `).run(paymentMethod, orderNo)
    
    // 增加用户积分
    const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.userId)
    db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(order.points, req.userId)
    
    // 记录积分变动
    db.prepare(`
      INSERT INTO point_transactions (user_id, type, amount, balance, description, related_id)
      VALUES (?, 'recharge', ?, ?, ?, ?)
    `).run(req.userId, order.points, user.points + order.points, `充值 ${order.package_name}`, orderNo)
    
    res.json({
      success: true,
      message: '支付成功',
      points: user.points + order.points,
      order
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 获取订单列表
router.get('/orders', auth, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
    `).all(req.userId)
    res.json({ orders })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ===== 会员相关 =====

// 开通/续费会员
router.post('/membership', auth, (req, res) => {
  const { type, months = 1 } = req.body // type: pro, enterprise
  
  const prices = { pro: 29, enterprise: 99 }
  const price = prices[type]
  
  if (!price) {
    return res.status(400).json({ error: '会员类型无效' })
  }
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId)
    
    // 计算过期时间
    let expireDate
    if (user.membership_expire && new Date(user.membership_expire) > new Date()) {
      const current = new Date(user.membership_expire)
      current.setMonth(current.getMonth() + months)
      expireDate = current.toISOString().split('T')[0]
    } else {
      const current = new Date()
      current.setMonth(current.getMonth() + months)
      expireDate = current.toISOString().split('T')[0]
    }
    
    // 更新会员
    db.prepare(`
      UPDATE users SET membership = ?, membership_expire = ? WHERE id = ?
    `).run(type, expireDate, req.userId)
    
    res.json({
      success: true,
      membership: type,
      expireDate
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: '服务器错误' })
  }
})

module.exports = router