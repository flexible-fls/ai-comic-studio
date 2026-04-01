/**
 * 设置管理员权限
 */
require('dotenv').config()
const db = require('./db.cjs')

// 先查看用户
const users = db.prepare('SELECT id, email, nickname, points, membership FROM users').all()
console.log('当前用户:', JSON.stringify(users, null, 2))

if (users.length > 0) {
  // 把第一个用户设为管理员，无限积分
  const userId = users[0].id
  db.prepare('UPDATE users SET points = 999999, membership = ? WHERE id = ?').run('enterprise', userId)
  
  console.log(`\n✅ 用户 ID=${userId} 已设为管理员`)
  console.log('- 积分: 999999')
  console.log('- 会员: enterprise')
  
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
  console.log('\n更新后:', JSON.stringify(updated, null, 2))
} else {
  console.log('\n暂无用户')
}