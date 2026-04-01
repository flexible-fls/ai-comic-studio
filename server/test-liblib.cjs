/**
 * 测试LiblibAI API连接
 */
require('dotenv').config()
const LiblibAI = require('./liblib.cjs')

async function test() {
  const accessKey = process.env.LIBLIB_ACCESS_KEY
  const secretKey = process.env.LIBLIB_SECRET_KEY

  if (!accessKey || !secretKey) {
    console.error('❌ 请配置 LIBLIB_ACCESS_KEY 和 LIBLIB_SECRET_KEY')
    process.exit(1)
  }

  console.log('🔑 AccessKey:', accessKey)
  console.log('🔐 SecretKey:', secretKey.substring(0, 8) + '...')

  const client = new LiblibAI(accessKey, secretKey)

  // 测试1: 获取账户信息
  console.log('\n📊 测试获取账户信息...')
  try {
    const info = await client.getAccountInfo()
    console.log('✅ 账户信息:', JSON.stringify(info, null, 2))
  } catch (error) {
    console.log('⚠️ 账户信息接口错误:', error.message)
  }

  // 测试2: Star-3 文生图
  console.log('\n🖼️ 测试Star-3文生图...')
  try {
    const result = await client.star3Txt2img({
      prompt: 'a cute cat, sitting on a chair',
      negative_prompt: 'ugly, blurry, low quality',
      width: 512,
      height: 512,
      steps: 20,
      image_num: 1,
    })
    console.log('✅ Star-3提交成功!')
    console.log(JSON.stringify(result, null, 2))
    
    // 如果有task_id，查询结果
    if (result.data?.task_id) {
      console.log('\n⏳ 轮询任务结果...')
      const taskResult = await client.waitForTask(result.data.task_id)
      console.log('✅ 任务完成!')
      console.log(JSON.stringify(taskResult, null, 2))
    }
  } catch (error) {
    console.error('❌ Star-3生成失败:', error.message)
  }

  // 测试3: Liblib自定义模型
  console.log('\n🎨 测试Liblib自定义模型...')
  try {
    const result = await client.liblibTxt2img({
      prompt: 'a beautiful sunset over ocean',
      negative_prompt: 'ugly, blurry',
      workflow_id: 'your-workflow-id',
      width: 512,
      height: 512,
      steps: 20,
    })
    console.log('✅ Liblib提交成功!')
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('❌ Liblib生成失败:', error.message)
  }
}

test()
