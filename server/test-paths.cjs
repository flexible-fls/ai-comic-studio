/**
 * 测试不同API路径
 */
require('dotenv').config()
const LiblibAI = require('./liblib.cjs')

const accessKey = process.env.LIBLIB_ACCESS_KEY
const secretKey = process.env.LIBLIB_SECRET_KEY
const client = new LiblibAI(accessKey, secretKey)

// 尝试不同的API路径
const paths = [
  '/api/genImg',
  '/api/generate/webui/text2img', 
  '/v1/txt2img',
  '/v1/generation',
  '/api/v1/txt2img',
  '/openapi/v1/txt2img',
]

async function testPaths() {
  for (const path of paths) {
    console.log(`\n🧪 Testing: ${path}`)
    try {
      const result = await client.request(path, {
        prompt: 'test',
        model_id: 'star3-alpha'
      })
      console.log(`   ✅ Success!`, result)
      return
    } catch (e) {
      console.log(`   ❌ ${e.message}`)
    }
  }
}

testPaths()
