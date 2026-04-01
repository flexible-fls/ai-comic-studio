/**
 * 调试签名
 */
require('dotenv').config()
const crypto = require('crypto')

const secretKey = '4QunKGLAbbtJfRUCQutD1lb393B6N3f8'
const uri = '/api/genImg'
const timestamp = '1774171565327'
const nonce = 'K71Vs9k8uu'

// 签名原文
const content = `${uri}&${timestamp}&${nonce}`
console.log('原文:', content)

// HmacSHA1
const hmac = crypto.createHmac('sha1', secretKey)
hmac.update(content)
const signature = hmac.digest('base64')
console.log('Base64:', signature)

// Base64URL
const urlSafe = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
console.log('Base64URL:', urlSafe)

// 测试其他格式
console.log('\n--- 尝试其他格式 ---')

// 格式2: 只有uri
const content2 = uri
const hmac2 = crypto.createHmac('sha1', secretKey)
hmac2.update(content2)
console.log('只用uri:', hmac2.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''))

// 格式3: timestamp&nonce
const content3 = `${timestamp}&${nonce}`
const hmac3 = crypto.createHmac('sha1', secretKey)
hmac3.update(content3)
console.log('timestamp&nonce:', hmac3.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''))

// 格式4: uri&timestamp
const content4 = `${uri}&${timestamp}`
const hmac4 = crypto.createHmac('sha1', secretKey)
hmac4.update(content4)
console.log('uri&timestamp:', hmac4.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''))

// 格式5: uri&timestamp&nonce  无&
const content5 = uri + timestamp + nonce
const hmac5 = crypto.createHmac('sha1', secretKey)
hmac5.update(content5)
console.log('uri+timestamp+nonce(无&):', hmac5.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''))

// 格式6: 换序 nonce&timestamp&uri
const content6 = `${nonce}&${timestamp}&${uri}`
const hmac6 = crypto.createHmac('sha1', secretKey)
hmac6.update(content6)
console.log('nonce&timestamp&uri:', hmac6.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''))
