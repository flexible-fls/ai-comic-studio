require('dotenv').config();
const LiblibAI = require('./liblib.cjs');

const client = new LiblibAI(
  process.env.LIBLIB_ACCESS_KEY,
  process.env.LIBLIB_SECRET_KEY
);

// 尝试不同参数组合
const tests = [
  // 尝试1: 加更多参数
  {
    prompt: 'a cute cat',
    negative_prompt: 'ugly, blurry',
    model_id: 'star3-alpha',
    templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',
    width: 512,
    height: 512,
    steps: 20,
    image_num: 1,
    cfg_scale: 7,
    sampler_name: 'Euler a',
    seed: -1
  },
  // 尝试2: 不传model_id，只传templateUuid
  {
    prompt: 'a cute cat',
    negative_prompt: 'ugly, blurry',
    templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',
    width: 512,
    height: 512,
    steps: 20,
    image_num: 1
  }
];

async function runTests() {
  for (let i = 0; i < tests.length; i++) {
    console.log(`\n🧪 尝试 ${i + 1}:`);
    try {
      const result = await client.request('/api/generate/webui/text2img', tests[i]);
      console.log('✅ 成功!', JSON.stringify(result).substring(0, 200));
      return;
    } catch (e) {
      console.log('❌', e.message);
    }
  }
}

runTests();
