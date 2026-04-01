const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const http = require('http')
require('dotenv').config()

const authRoutes = require('./routes/auth.cjs')
const projectRoutes = require('./routes/projects.cjs')
const pointsRoutes = require('./routes/points.cjs')
const ai = require('./ai.cjs')

const app = express()
const PORT = process.env.PORT || 3001

// 创建HTTP服务器
const server = http.createServer(app)

// 初始化WebSocket（延迟加载避免依赖问题）
let wsModule = null
try {
  wsModule = require('./websocket.cjs')
  wsModule.createWebSocketServer(server)
  console.log('✅ WebSocket 服务已启动')
} catch (e) {
  console.log('⚠️ WebSocket 服务初始化失败:', e.message)
}

// 中间件
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/points', pointsRoutes)

// 文件解析上传
const upload = multer({ dest: path.join(__dirname, 'uploads') })

// ========== 解析剧本文件 ==========
app.post('/api/parse-script', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ error: '没有文件' })
    
    try {
      let script = ''
      const ext = file.originalname.toLowerCase()
      
      if (ext.endsWith('.txt') || ext.endsWith('.md') || ext.endsWith('.json')) {
        script = fs.readFileSync(file.path, 'utf-8')
      } else if (ext.endsWith('.docx')) {
        script = await parseDocx(file.path)
      } else if (ext.endsWith('.pdf')) {
        script = await parsePdf(file.path)
      } else {
        script = '不支持的文件格式'
      }
      
      fs.unlinkSync(file.path)
      res.json({ script })
    } catch (e) {
      res.status(500).json({ error: '解析失败: ' + e.message })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== 生成角色三视图 (DeepSeek) ==========
app.post('/api/generate-characters', async (req, res) => {
  try {
    const { script, style } = req.body
    
    if (!script) {
      return res.status(400).json({ error: '请提供剧本内容' })
    }
    
    // 调用DeepSeek生成角色
    const characters = await ai.generateCharacters(script, style)
    
    res.json({ characters })
  } catch (error) {
    console.error('生成角色错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// ========== 生成分镜 (DeepSeek) ==========
app.post('/api/projects/storyboard', async (req, res) => {
  try {
    const { script, style, characters } = req.body
    
    if (!script) {
      return res.status(400).json({ error: '请提供剧本内容' })
    }
    
    // 调用DeepSeek生成分镜
    const storyboard = await ai.generateStoryboard(script, style, characters)
    
    res.json({ storyboard })
  } catch (error) {
    console.error('生成分镜错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// ========== 生成图片 (Liblib) ==========
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, style, characterRef } = req.body
    
    const result = await ai.generateImageWithStyle(prompt, style, characterRef)
    
    res.json(result)
  } catch (error) {
    console.error('生成图片错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// ========== 生成视频 (Runway) ==========
app.post('/api/generate-video', async (req, res) => {
  try {
    const { images } = req.body
    
    if (!images || images.length === 0) {
      return res.status(400).json({ error: '请提供图片' })
    }
    
    const result = await ai.generateVideo(images)
    
    res.json(result)
  } catch (error) {
    console.error('生成视频错误:', error)
    res.status(500).json({ error: error.message })
  }
})

// DOCX解析
async function parseDocx(filePath) {
  try {
    const mammoth = require('mammoth')
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  } catch (e) {
    return '解析DOCX失败: ' + e.message
  }
}

// PDF解析
async function parsePdf(filePath) {
  try {
    const pdfParse = require('pdf-parse')
    const dataBuffer = fs.readFileSync(filePath)
    const result = await pdfParse(dataBuffer)
    return result.text
  } catch (e) {
    return '解析PDF失败: ' + e.message
  }
}

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: '服务器错误' })
})

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 WebSocket available at ws://localhost:${PORT}/ws`)
})

// 导出WebSocket模块
module.exports.ws = wsModule
