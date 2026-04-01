require('dotenv').config();
const LiblibAI = require('./liblib.cjs');

const client = new LiblibAI(
  process.env.LIBLIB_ACCESS_KEY,
  process.env.LIBLIB_SECRET_KEY
);

client.request('/api/generate/webui/text2img', {
  prompt: 'a cute cat',
  negative_prompt: 'ugly, blurry',
  model_id: 'star3-alpha',
  templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',
  width: 512,
  height: 512,
  steps: 20,
  image_num: 1
}).then(r => console.log(JSON.stringify(r, null, 2)))
.catch(e => console.log('Error:', e.message));
