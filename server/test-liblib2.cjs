/**
 * 测试LiblibAI API - 简化版本
 */
require('dotenv').config()
const LiblibAI = require('./liblib.cjs')

async function test() {
  const accessKey = process.env.LIBLIB_ACCESS_KEY
  const secretKey = process.env.LIBLIB_SECRET_KEY

  console.log('🔑 AccessKey:', accessKey)
  console.log('🔐 SecretKey:', secretKey.substring(0, 8) + '...')

  const client = new LiblibAI(accessKey, secretKey)

  // 测试1: 不带templateUuid
  console.log('\n🖼️ 测试1: 不带templateUuid...')
  try {
    const result = await client.star3Txt2img({
      prompt: 'a cute cat, sitting on a chair, anime style',
      negative_prompt: 'ugly, blurry, low quality',
      aspectRatio: 'square',
      imageSize: { width: 1024, height: 1024 },
      imgCount: 1,
      steps: 20,
      cfg_scale: 7,
      seed: -1,
    })
    console.log('✅ 提交成功!', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('❌ 失败:', error.message)
  }

  // 测试2: 使用生成图片便捷方法
  console.log('\n🎨 测试2: generate()方法...')
  try {
    const result = await client.generate({
      prompt: 'a beautiful sunset, anime style',
      negative_prompt: 'ugly, blurry',
      aspectRatio: 'square',
      imageSize: { width: 1024, height: 1024 },
      imgCount: 1,
      steps: 20,
      cfg_scale: 7,
      seed: -1,
    })
    console.log('✅ 成功!', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('❌ 失败:', error.message)
  }

  // 测试3: 尝试空templateUuid
  console.log('\n📝 测试3: 空templateUuid...')
  try {
    const result = await client.star3Txt2img({
      prompt: 'a cute cat',
      templateUuid: '',  // 尝试空字符串
      aspectRatio: 'square',
      imageSize: { width: 1024, height: 1024 },
      imgCount: 1,
    })
    console.log('✅ 提交成功!', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('❌ 失败:', error.message)
  }
}

test()