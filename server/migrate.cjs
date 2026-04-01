/**
 * 数据库迁移 - 添加新字段
 */
require('dotenv').config()
const db = require('./db.cjs')

// 检查并添加新字段
try {
  // 添加 points 字段
  db.exec(`ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 500`)
  console.log('✅ 添加 points 字段')
} catch(e) {
  console.log('ℹ️ points 字段已存在或无需添加')
}

try {
  // 添加 membership 字段
  db.exec(`ALTER TABLE users ADD COLUMN membership TEXT DEFAULT 'free'`)
  console.log('✅ 添加 membership 字段')
} catch(e) {
  console.log('ℹ️ membership 字段已存在')
}

try {
  // 添加 membership_expire 字段
  db.exec(`ALTER TABLE users ADD COLUMN membership_expire DATE`)
  console.log('✅ 添加 membership_expire 字段')
} catch(e) {
  console.log('ℹ️ membership_expire 字段已存在')
}

try {
  // 添加 last_login 字段
  db.exec(`ALTER TABLE users ADD COLUMN last_login DATETIME`)
  console.log('✅ 添加 last_login 字段')
} catch(e) {
  console.log('ℹ️ last_login 字段已存在')
}

// 更新用户积分为500
const updateResult = db.prepare('UPDATE users SET points = 500 WHERE points IS NULL OR points = 0').run()
console.log(`\n✅ 更新了 ${updateResult.changes} 个用户的积分`)

console.log('\n数据库迁移完成！')