const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'data', 'ai-comic.db')
const db = new Database(dbPath)

// 初始化数据库表
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT,
    points INTEGER DEFAULT 500,  -- 新用户赠送500积分
    membership TEXT DEFAULT 'free',  -- free, pro, enterprise
    membership_expire DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  -- 项目表
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    script TEXT,
    style TEXT DEFAULT '2d_jp',
    storyboard TEXT,
    characters TEXT,
    cover TEXT,
    status TEXT DEFAULT 'draft',  -- draft, processing, completed, failed
    progress INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 积分记录表
  CREATE TABLE IF NOT EXISTS point_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,  -- earn, spend, recharge, refund
    amount INTEGER NOT NULL,
    balance INTEGER NOT NULL,
    description TEXT,
    related_id TEXT,  -- 关联的project_id或order_id
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 订单表
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_no TEXT UNIQUE NOT NULL,
    package_id INTEGER NOT NULL,
    package_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT,  -- wechat, alipay, bank
    status TEXT DEFAULT 'pending',  -- pending, paid, failed, refunded
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 充值套餐表
  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    points INTEGER NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    tag TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// 初始化充值套餐数据
const existingPackages = db.prepare('SELECT COUNT(*) as count FROM packages').get()
if (existingPackages.count === 0) {
  const insertPackage = db.prepare(`
    INSERT INTO packages (name, points, price, original_price, tag, sort_order) 
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  
  insertPackage.run('Starter', 100, 9, 19, '热销', 1)
  insertPackage.run('Plus', 500, 39, 79, '超值', 2)
  insertPackage.run('Pro', 1000, 69, 139, '推荐', 3)
  insertPackage.run('Enterprise', 5000, 299, 599, '', 4)
  
  console.log('✅ 充值套餐初始化完成')
}

// 创建索引
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_user ON point_transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
`)

module.exports = db