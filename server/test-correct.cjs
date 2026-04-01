require('dotenv').config();
const LiblibAI = require('./liblib.cjs');

const client = new LiblibAI(
  process.env.LIBLIB_ACCESS_KEY,
  process.env.LIBLIB_SECRET_KEY
);

// 用正确的格式测试
async function test() {
  console.log('🧪 测试正确格式...');
  
  try {
    const result = await client.star3Txt2img({
      prompt: 'a cute cat',
      negative_prompt: 'ugly, blurry',
      templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',  // 从文档示例
      aspectRatio: 'square',
      imageSize: { width: 1024, height: 1024 },
      imgCount: 1,
      steps: 25,
      cfg_scale: 7,
      seed: -1,
    });
    console.log('✅ 提交成功!');
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('❌', e.message);
  }
}

test();
