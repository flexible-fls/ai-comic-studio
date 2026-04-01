/**
 * LiblibAI API 客户端
 * 基于Liblib AI开放平台: https://www.liblib.ai
 * API地址: https://openapi.liblibai.cloud
 */

const hmacsha1 = require('hmacsha1');
const stringRandom = require('string-random');

class LiblibAI {
  constructor(accessKey, secretKey, baseUrl = 'https://openapi.liblibai.cloud') {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }

  /**
   * 生成签名
   */
  generateSignature(uri) {
    const timestamp = Date.now();
    const signatureNonce = stringRandom(16);
    const str = `${uri}&${timestamp}&${signatureNonce}`;
    const hash = hmacsha1(this.secretKey, str);
    let signature = hash
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return { signature, timestamp: timestamp.toString(), signatureNonce };
  }

  /**
   * 发送API请求
   */
  async request(path, data, method = 'POST') {
    const { signature, timestamp, signatureNonce } = this.generateSignature(path);
    
    const url = new URL(path, this.baseUrl);
    url.searchParams.set('AccessKey', this.accessKey);
    url.searchParams.set('Signature', signature);
    url.searchParams.set('Timestamp', timestamp);
    url.searchParams.set('SignatureNonce', signatureNonce);
    
    const fullUrl = url.toString();
    console.log(`📡 Request: ${method} ${fullUrl}`);
    
    const headers = { 'Content-Type': 'application/json' };
    const body = method === 'GET' ? undefined : JSON.stringify(data);

    try {
      const response = await fetch(fullUrl, { method, headers, body });
      const result = await response.json();
      console.log('   Response:', JSON.stringify(result));
      
      if (!response.ok || (result.code && result.code !== 0)) {
        throw new Error(result.msg || result.message || `API Error: ${response.status}`);
      }
      return result;
    } catch (error) {
      console.error('   Error:', error.message);
      throw error;
    }
  }

  /**
   * Star-3 文生图 (txt2img)
   * POST /api/generate/webui/text2img/ultra
   */
  async star3Txt2img(params) {
    const {
      prompt,
      negative_prompt = '',
      templateUuid = '5d7e67009b344550bc1aa6ccbfa1d7f4',  // 模板ID
      aspectRatio = 'square',  // square/portrait/landscape
      imageSize = { width: 1024, height: 1024 },
      imgCount = 1,
      steps = 25,
      cfg_scale = 7,
      seed = -1,
    } = params;

    const data = {
      templateUuid,
      generateParams: {
        prompt,
        negative_prompt,
        aspectRatio,
        imageSize,
        imgCount,
        steps,
        cfg_scale,
        seed,
      }
    };

    return this.request('/api/generate/webui/text2img/ultra', data);
  }

  /**
   * Star-3 图生图 (img2img)
   * POST /api/generate/webui/img2img/ultra
   */
  async star3Img2img(params) {
    const {
      prompt,
      negative_prompt = '',
      templateUuid = '',
      initImage = '',  // 初始图片URL
      aspectRatio = 'square',
      imageSize = { width: 1024, height: 1024 },
      imgCount = 1,
      denoising_strength = 0.75,
      steps = 25,
      cfg_scale = 7,
      seed = -1,
    } = params;

    const data = {
      templateUuid,
      generateParams: {
        prompt,
        negative_prompt,
        aspectRatio,
        imageSize,
        imgCount,
        denoising_strength,
        steps,
        cfg_scale,
        seed,
      },
      controlnet: initImage ? [{
        controlType: 'line',
        controlImage: initImage,
      }] : []
    };

    return this.request('/api/generate/webui/img2img/ultra', data);
  }

  /**
   * 查询任务状态 (POST)
   */
  async getTaskResult(generateUuid) {
    const data = { generateUuid };
    return this.request('/api/generate/webui/status', data);
  }

  /**
   * 轮询等待任务完成
   */
  async waitForTask(taskId, maxAttempts = 60, interval = 3000) {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await this.getTaskResult(taskId);
      
      // generateStatus: 2=处理中, 5=成功, 6=失败
      if (result.data?.generateStatus === 5 && result.data?.images?.length > 0) {
        return result;
      } else if (result.data?.generateStatus === 6) {
        throw new Error(result.data?.error || 'Generation failed');
      }
      
      console.log(`   ⏳ Progress: ${Math.round((result.data?.percentCompleted || 0) * 100)}%`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error('Task timeout');
  }

  /**
   * 便捷方法: 生成图片
   */
  async generate(params) {
    const result = await this.star3Txt2img(params);
    
    if (result.data?.generateUuid) {
      console.log(`   📋 Task ID: ${result.data.generateUuid}`);
      return this.waitForTask(result.data.generateUuid);
    }
    return result;
  }
}

module.exports = LiblibAI;
