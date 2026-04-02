# 部署指南

## 方案一：Railway + Vercel（推荐）

### 1. 部署后端到 Railway

1. 访问 [Railway.app](https://railway.app) 并登录（可用 GitHub 账号）
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择 `flexible-fls/ai-comic-studio` 仓库
4. Railway 会自动检测 Node.js 项目
5. 在 "Settings" → "Environment Variables" 中添加：
   - `PORT`: `3001`
   - `JWT_SECRET`: `your-secret-key`
6. Railway 会自动部署后端
7. 部署完成后，Railway 会提供一个 URL，如：`https://ai-comic-studio.up.railway.app`

### 2. 修改前端 API 地址

1. 在本地项目中修改所有 `API_URL`：
   - `src/pages/Login.jsx`: `const API_URL = 'https://your-railway-url.up.railway.app/api'`
   - `src/pages/Dashboard.jsx`: 同上
   - `src/pages/History.jsx`: 同上
   - `src/pages/WorkflowNew.jsx`: 同上
   - `src/pages/WorkflowDetail.jsx`: 同上
   - `src/store/useStore.js`: 同上

2. 推送到 GitHub，Vercel 会自动部署前端

### 3. 配置自定义域名（可选）

在 Railway 和 Vercel 控制台中都可以绑定自定义域名。

---

## 方案二：Zeabur（更简单）

1. 访问 [Zeabur.com](https://zeabur.com) 并登录
2. 点击 "New Project" → "Deploy from GitHub"
3. 选择仓库，Zeabur 会自动部署后端
4. 获取后端 URL
5. 修改前端代码中的 API 地址
6. 部署前端到 Vercel

---

## 方案三：本地运行

```bash
# 安装后端依赖
cd server
npm install

# 复制环境变量
cp .env.example .env

# 启动后端
npm start

# 前端会使用 localhost:3001/api
```
