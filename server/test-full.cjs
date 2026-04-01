/**
 * 测试完整参数
 */
require('dotenv').config()
const LiblibAI = require('./liblib.cjs')

const accessKey = process.env.LIBLIB_ACCESS_KEY
const secretKey = process.env.LIBLIB_SECRET_KEY
const client = new LiblibAI(accessKey, secretKey)

// 完整的Star-3生图参数
async function test() {
  console.log('🧪 测试完整Star-3参数...')
  
  try {
    const result = await client.request('/api/generate/webui/text2img', {
      prompt: 'a cute cat sitting on a chair, cute, adorable, fluffy',
      negative_prompt: 'ugly, blurry, low quality, bad anatomy',
      model_id: 'star3-alpha',  // 或 star3
      width: 512,
      height: 512,
      steps: 20,
      cfg_scale: 7,
      sampler_name: 'Euler a',
      seed: -1,
      image_num: 1,
    })
    console.log('✅ 提交成功!')
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error('❌ 错误:', e.message)
  }
}

test()
