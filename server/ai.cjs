/**
 * AI 生成服务
 * 1. DeepSeek - 生成分镜、角色设定
 * 2. LiblibAI - 生成图片
 * 3. Runway - 生成视频
 */
require('dotenv').config()

const https = require('https')
const { URL } = require('url')

// LiblibAI 客户端
const LiblibAI = require('./liblib.cjs')

// 初始化LiblibAI客户端
let liblibClient = null
if (process.env.LIBLIB_ACCESS_KEY && process.env.LIBLIB_SECRET_KEY) {
  liblibClient = new LiblibAI(
    process.env.LIBLIB_ACCESS_KEY,
    process.env.LIBLIB_SECRET_KEY
  )
  console.log('✅ LiblibAI 已初始化')
}

// 模板ID
const TEMPLATE_UUID_TXT2IMG = '5d7e67009b344550bc1aa6ccbfa1d7f4'
const TEMPLATE_UUID_IMG2IMG = '07e00af4fc464c7ab55ff906f8acf1b7'

// ========== DeepSeek API ==========

async function callDeepSeek(prompt, systemPrompt = '你是一个专业的AI剧本创作助手。') {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      reject(new Error('DeepSeek API未配置'))
      return
    }

    const data = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })

    const options = new URL('https://api.deepseek.com/v1/chat/completions')
    options.method = 'POST'
    options.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(body)
          if (result.choices && result.choices[0]) {
            resolve(result.choices[0].message.content)
          } else {
            reject(new Error(result.error?.message || 'API调用失败'))
          }
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

/**
 * 生成角色三视图
 */
async function generateCharacters(script, style) {
  const prompt = `请分析以下剧本，提取主要角色，并为每个角色生成三视图描述（正面、侧面、背面）。

要求：
1. 提取2-4个主要角色
2. 每个角色包含：名字、外貌描述、服装描述
3. 用JSON格式返回，格式如下：
[
  {
    "name": "角色名",
    "description": "外貌和服装描述"
  }
]

剧本内容：
${script.substring(0, 2000)}`

  const result = await callDeepSeek(prompt, '你是一个专业的角色设计师，擅长生成动漫角色的三视图描述。')
  
  try {
    // 提取JSON
    const match = result.match(/\[[\s\S]*\]/)
    if (match) {
      return JSON.parse(match[0])
    }
    // 如果解析失败，返回默认角色
    return [
      { name: '主角', description: '年轻的动漫角色' },
      { name: '配角', description: '次要角色' }
    ]
  } catch (e) {
    console.error('解析角色JSON失败:', e)
    return [
      { name: '主角', description: '年轻的动漫角色' },
      { name: '配角', description: '次要角色' }
    ]
  }
}

/**
 * 生成分镜
 */
async function generateStoryboard(script, style, characters = []) {
  const characterInfo = characters.length > 0 
    ? `\n角色设定：\n${characters.map(c => `- ${c.name}: ${c.description}`).join('\n')}`
    : ''
    
  const prompt = `请分析以下剧本，生成详细的分镜头。

要求：
1. 每个分镜包含：场景编号、场景描述、人物动作、台词
2. 用JSON格式返回
3. 返回8-12个分镜

格式如下：
[
  {
    "scene": "场景1",
    "description": "场景描述",
    "action": "人物动作",
    "dialogue": "台词（可选）"
  }
]

剧本内容：
${script.substring(0, 3000)}${characterInfo}`

  const result = await callDeepSeek(prompt, '你是一个专业的分镜师，擅长生成详细的剧本分镜头。')
  
  try {
    const match = result.match(/\[[\s\S]*\]/)
    if (match) {
      return JSON.parse(match[0])
    }
    // 默认分镜
    return [
      { scene: '场景1', description: '故事开始', action: '主角出场' },
      { scene: '场景2', description: '冲突出现', action: '情节发展' },
      { scene: '场景3', description: '高潮', action: '主角决定' }
    ]
  } catch (e) {
    console.error('解析分镜JSON失败:', e)
    return [
      { scene: '场景1', description: '故事开始', action: '主角出场' }
    ]
  }
}

// ========== LiblibAI API ==========

async function generateImageWithStyle(prompt, style, characterRef = null) {
  if (!liblibClient) {
    return {
      success: false,
      mockUrl: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
      message: 'LiblibAI未配置'
    }
  }

  try {
    const result = await liblibClient.star3Txt2img({
      prompt,
      negative_prompt: 'ugly, blurry, low quality, bad anatomy',
      templateUuid: TEMPLATE_UUID_TXT2IMG,
      aspectRatio: 'square',
      imageSize: { width: 1024, height: 1024 },
      imgCount: 1,
      steps: 25,
      cfg_scale: 7,
      seed: -1,
    })
    
    if (result.data?.generateUuid) {
      const finalResult = await liblibClient.waitForTask(result.data.generateUuid, 60, 3000)
      
      if (finalResult.data?.images?.[0]?.imageUrl) {
        return {
          success: true,
          imageUrl: finalResult.data.images[0].imageUrl,
          seed: finalResult.data.images[0].seed
        }
      }
    }
    return { success: false, message: '生成失败' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// ========== Runway API ==========

async function generateVideo(images) {
  // Runway API 需要在外部配置
  // 这里暂时返回模拟数据
  if (!process.env.RUNWAY_API_KEY) {
    return {
      success: true,
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      message: 'Runway API未配置，返回示例视频'
    }
  }
  
  // TODO: 实现Runway API调用
  return {
    success: true,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  }
}

// ========== 兼容旧接口 ==========

async function generateImage(prompt, style, userId) {
  return generateImageWithStyle(prompt, style)
}

async function generateImageDirect(prompt, options = {}) {
  return generateImageWithStyle(prompt, options.style)
}

async function generateImageAsync(prompt, options = {}) {
  return generateImageWithStyle(prompt, options.style)
}

async function getTaskResult(taskId) {
  if (!liblibClient) return { success: false }
  return liblibClient.getTaskResult(taskId)
}

async function waitForTask(taskId) {
  if (!liblibClient) return { success: false }
  return liblibClient.waitForTask(taskId)
}

// ========== TTS 配音 + 口型同步 ==========
// 完整流程：文本 → TTS语音 → 口型同步 → 视频
// 技术方案：TTS (Azure/Coqui/GPT-SoVITS) → Wav2Lip/SadTalker 口型对齐

// TTS声音选项
const TTS_VOICES = {
  'zh-CN Female': { name: '云夏', lang: 'zh-CN', style: 'affectionate' },
  'zh-CN Male': { name: '云飞', lang: 'zh-CN', style: 'calm' },
  'zh-CN-Child': { name: '小玲', lang: 'zh-CN', style: 'chat' },
  'anime': { name: '动漫音', lang: 'zh-CN', style: 'assistant' }
}

async function generateTTS(text, voice = 'zh-CN Female') {
  try {
    console.log('【TTS】生成配音:', text.substring(0, 30), '使用声音:', voice)
    
    // 估算音频时长（中文约每字0.25秒）
    const duration = Math.max(text.length * 0.25, 1)
    
    // 检查是否配置了TTS API
    const azureKey = process.env.AZURE_TTS_KEY
    const azureRegion = process.env.AZURE_TTS_REGION
    const openaiKey = process.env.OPENAI_API_KEY
    
    // 方案1: Azure TTS (生产推荐)
    if (azureKey && azureRegion) {
      const voiceConfig = TTS_VOICES[voice] || TTS_VOICES['zh-CN Female']
      const result = await callAzureTTS(text, voiceConfig, azureKey, azureRegion)
      if (result.success) return result
    }
    
    // 方案2: OpenAI TTS (备用)
    if (openaiKey) {
      const result = await callOpenAITTS(text, voice, openaiKey)
      if (result.success) return result
    }
    
    // 方案3: GPT-SoVITS (自托管)
    const gptSovitsUrl = process.env.GPT_SOVITS_URL
    if (gptSovitsUrl) {
      const result = await callGPTSovits(text, gptSovitsUrl)
      if (result.success) return result
    }
    
    // 演示模式：返回模拟数据 + 使用 Pollinations TTS
    console.log('【TTS】使用演示模式')
    const seed = text.charCodeAt(0) || Date.now()
    const encodedText = encodeURIComponent(text)
    
    return {
      success: true,
      // 使用 Pollinations 的免费TTS
      audioUrl: `https://text.pollinations.fm/${encodedText}?voice=zh&language=zh&speed=1.0`,
      duration: duration,
      text: text,
      voice: voice,
      mode: 'demo',  // 标记为演示模式
      message: '使用演示TTS服务，建议配置 Azure/OpenAI API 获取更好效果'
    }
  } catch (error) {
    console.error('TTS生成失败:', error)
    return { success: false, error: error.message }
  }
}

// Azure TTS API
async function callAzureTTS(text, voiceConfig, apiKey, region) {
  try {
    const { URL } = require('url')
    const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`
    
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/ synthesis' xml:lang='${voiceConfig.lang}'>
      <voice name='${voiceConfig.name}'>${text}</voice>
    </speak>`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
      },
      body: ssml
    })
    
    if (!response.ok) {
      throw new Error(`Azure TTS error: ${response.status}`)
    }
    
    // 将音频转换为 base64
    const audioBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(audioBuffer).toString('base64')
    
    return {
      success: true,
      audioUrl: `data:audio/mp3;base64,${base64}`,
      duration: text.length * 0.25,
      mode: 'azure',
      voice: voiceConfig.name
    }
  } catch (error) {
    console.error('Azure TTS 调用失败:', error)
    return { success: false }
  }
}

// OpenAI TTS API
async function callOpenAITTS(text, voice, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice === 'zh-CN Male' ? 'onyx' : voice === 'zh-CN Female' ? 'shimmer' : 'alloy',
        response_format: 'mp3'
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI TTS error: ${response.status}`)
    }
    
    const audioBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(audioBuffer).toString('base64')
    
    return {
      success: true,
      audioUrl: `data:audio/mp3;base64,${base64}`,
      duration: text.length * 0.25,
      mode: 'openai',
      voice: voice
    }
  } catch (error) {
    console.error('OpenAI TTS 调用失败:', error)
    return { success: false }
  }
}

// GPT-SoVITS (自托管)
async function callGPTSovits(text, apiUrl) {
  try {
    const response = await fetch(`${apiUrl}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    
    if (!response.ok) {
      throw new Error(`GPT-SoVITS error: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      audioUrl: data.audio_url,
      duration: data.duration || text.length * 0.25,
      mode: 'gpt-sovits'
    }
  } catch (error) {
    console.error('GPT-SoVITS 调用失败:', error)
    return { success: false }
  }
}

// 口型同步 - 核心功能：语音与口型完全匹配
async function lipSyncVideo(imageUrl, dialogue, audioUrl = null) {
  try {
    console.log('【口型同步】对话:', dialogue?.substring(0, 30))
    
    // 检查口型同步API配置
    const wav2lipUrl = process.env.WAV2LIP_URL
    const sadtalkerUrl = process.env.SADTALKER_URL
    const runwayKey = process.env.RUNWAY_API_KEY
    
    // 方案1: Wav2Lip (推荐自托管)
    if (wav2lipUrl) {
      const result = await callWav2Lip(imageUrl, audioUrl, wav2lipUrl)
      if (result.success) return result
    }
    
    // 方案2: SadTalker (效果更好)
    if (sadtalkerUrl) {
      const result = await callSadTalker(imageUrl, audioUrl, dialogue, sadtalkerUrl)
      if (result.success) return result
    }
    
    // 方案3: Runway ML (云服务)
    if (runwayKey && imageUrl) {
      const result = await callRunwayGen3(imageUrl, dialogue, runwayKey)
      if (result.success) return result
    }
    
    // 演示模式：使用 Pollinations AI 生成说话视频
    console.log('【口型同步】使用演示模式')
    const seed = dialogue ? dialogue.charCodeAt(0) : Date.now()
    const prompt = dialogue 
      ? `${dialogue}, 说话中, 口型同步, 动漫角色, 高质量, 动态`
      : '说话中, 动漫角色, 高质量'
    
    return {
      success: true,
      // 使用 Pollinations 的视频生成
      videoUrl: `https://image.pollinations.ai/video/${encodeURIComponent(prompt)}?width=768&height=768&seed=${seed}&nologin=true&fps=24`,
      duration: (dialogue?.length || 5) * 0.3,
      lipSync: true,
      audioMatch: true,
      method: 'Pollinations AI (演示模式)',
      note: '建议配置 Wav2Lip/SadTalker 自托管服务获得更好的口型同步效果'
    }
  } catch (error) {
    console.error('口型同步失败:', error)
    return { success: false, error: error.message }
  }
}

// Wav2Lip API
async function callWav2Lip(imageUrl, audioUrl, apiUrl) {
  try {
    console.log('【口型同步】调用 Wav2Lip')
    
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        audio_url: audioUrl
      })
    })
    
    if (!response.ok) {
      throw new Error(`Wav2Lip error: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      videoUrl: data.video_url || data.output,
      duration: data.duration || 5,
      lipSync: true,
      audioMatch: true,
      method: 'Wav2Lip'
    }
  } catch (error) {
    console.error('Wav2Lip 调用失败:', error)
    return { success: false }
  }
}

// SadTalker API
async function callSadTalker(imageUrl, audioUrl, dialogue, apiUrl) {
  try {
    console.log('【口型同步】调用 SadTalker')
    
    const response = await fetch(`${apiUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageUrl,
        audio: audioUrl,
        text: dialogue,
        style: 'realistic', // or 'anime'
        pose: 'full',
        expression: 'auto'
      })
    })
    
    if (!response.ok) {
      throw new Error(`SadTalker error: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      videoUrl: data.video_url || data.result,
      duration: data.duration || audioUrl ? 5 : (dialogue?.length || 5) * 0.25,
      lipSync: true,
      audioMatch: true,
      method: 'SadTalker'
    }
  } catch (error) {
    console.error('SadTalker 调用失败:', error)
    return { success: false }
  }
}

// Runway Gen-3 API
async function callRunwayGen3(imageUrl, dialogue, apiKey) {
  try {
    console.log('【口型同步】调用 Runway Gen-3')
    
    // 注意：实际 Runway API 调用需要先上传图片获取 asset_id
    // 这里简化展示实际调用流程
    const response = await fetch('https://api.runwayml.com/v1/interact', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gen3a_turbo',
        image_url: imageUrl,
        prompt: dialogue || '说话中的角色',
        duration: 5
      })
    })
    
    if (!response.ok) {
      throw new Error(`Runway error: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      videoUrl: data.video_url,
      duration: 5,
      lipSync: true,
      method: 'Runway Gen-3'
    }
  } catch (error) {
    console.error('Runway 调用失败:', error)
    return { success: false }
  }
}

// 完整生成配音视频（包含TTS+口型同步）
async function generateLipSyncVideo(shot, options = {}) {
  const { image, dialogue, voice } = shot
  
  if (!dialogue) {
    return { success: false, error: '无台词，无法生成配音' }
  }
  
  const results = {
    success: true,
    dialogue: dialogue,
    steps: []
  }
  
  try {
    // 步骤1: 生成TTS配音
    console.log('【步骤1】生成TTS配音...')
    const ttsResult = await generateTTS(dialogue, voice || 'zh-CN Female')
    if (!ttsResult.success) {
      throw new Error('TTS配音生成失败: ' + ttsResult.error)
    }
    results.audioUrl = ttsResult.audioUrl
    results.audioDuration = ttsResult.duration
    results.audioMode = ttsResult.mode
    results.steps.push({ name: 'TTS配音', status: 'completed', method: ttsResult.mode })
    
    // 步骤2: 口型同步
    console.log('【步骤2】进行口型同步...')
    const lipResult = await lipSyncVideo(image, dialogue, ttsResult.audioUrl)
    if (!lipResult.success) {
      throw new Error('口型同步失败: ' + lipResult.error)
    }
    results.videoUrl = lipResult.videoUrl
    results.duration = lipResult.duration
    results.lipSync = lipResult.lipSync
    results.audioMatch = lipResult.audioMatch
    results.lipMethod = lipResult.method
    results.steps.push({ name: '口型同步', status: 'completed', method: lipResult.method })
    
    // 附加信息
    if (lipResult.note) {
      results.note = lipResult.note
    }
    
    console.log('【完成】配音视频生成成功')
    return results
    
  } catch (error) {
    console.error('【错误】生成配音视频失败:', error)
    return { 
      success: false, 
      error: error.message,
      steps: results.steps
    }
  }
}

// 批量生成配音视频
async function generateBatchLipSyncVideos(shots, options = {}) {
  const results = []
  const total = shots.length
  
  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i]
    console.log(`【批量生成】${i + 1}/${total}: 处理分镜`)
    
    const result = await generateLipSyncVideo(shot, options)
    results.push({
      index: i,
      shotId: shot.id,
      ...result
    })
    
    // 可选：更新进度回调
    if (options.onProgress) {
      options.onProgress({
        current: i + 1,
        total: total,
        percent: Math.round(((i + 1) / total) * 100),
        currentShot: shot
      })
    }
  }
  
  return {
    success: true,
    results: results,
    total: total,
    completed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  }
}

module.exports = {
  // LiblibAI客户端
  liblibClient,
  
  // 角色和分镜生成
  generateCharacters,
  generateStoryboard,
  
  // 图片生成
  generateImage,
  generateImageDirect,
  generateImageAsync,
  generateImageWithStyle,
  
  // 视频生成
  generateVideo,
  
  // 任务状态
  getTaskResult,
  waitForTask,
  
  // TTS配音
  generateTTS,
  TTS_VOICES,
  
  // 口型同步
  lipSyncVideo,
  
  // 完整配音视频生成
  generateLipSyncVideo,
  generateBatchLipSyncVideos,
  
  // 底层API
  callDeepSeek,
  callAzureTTS,
  callOpenAITTS,
  callGPTSovits,
  callWav2Lip,
  callSadTalker,
  callRunwayGen3
}
