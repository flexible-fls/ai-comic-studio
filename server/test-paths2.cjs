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
  '/api/generate/webui/text2img/ultra',
  '/api/generation/txt2img',
]

async function testPaths() {
  for (const path of paths) {
    console.log(`\n🧪 Testing: ${path}`)
    try {
      const result = await client.request(path, {
        prompt: 'a cute cat',
        model_id: 'star3-alpha',
        width: 512,
        height: 512,
      })
      console.log(`   ✅ Success!`, JSON.stringify(result).substring(0, 200))
      return
    } catch (e) {
      console.log(`   ❌ ${e.message.substring(0, 100)}`)
    }
  }
}

testPaths()
