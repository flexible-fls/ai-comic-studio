require('dotenv').config();
const LiblibAI = require('./liblib.cjs');

const client = new LiblibAI(
  process.env.LIBLIB_ACCESS_KEY,
  process.env.LIBLIB_SECRET_KEY
);

// 尝试不传templateUuid，只传model_id
async function test() {
  console.log('🧪 尝试: model_id only');
  try {
    const result = await client.request('/api/generate/webui/text2img', {
      prompt: 'a cute cat',
      negative_prompt: 'ugly, blurry',
      model_id: 'star3-alpha',
      width: 1024,
      height: 1024,
      steps: 25,
      image_num: 1,
      cfg_scale: 7,
      sampler_name: 'Euler a',
      seed: -1
    });
    console.log('✅ 成功!', JSON.stringify(result).substring(0, 300));
  } catch (e) {
    console.log('❌', e.message);
  }
}

test();
