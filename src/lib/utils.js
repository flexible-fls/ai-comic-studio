import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const STYLE_OPTIONS = [
  { id: '2d_anime', name: '2D动漫', prompt: 'anime style, 2D' },
  { id: '2d_jp', name: '2D日漫', prompt: 'Japanese anime style, manga' },
  { id: '2d_cn', name: '2D国漫', prompt: 'Chinese comic style, Chinese anime' },
  { id: '3d', name: '3D动漫', prompt: '3D CGI animation style, Pixar-like' },
  { id: 'live', name: '真人电影', prompt: 'cinematic, photorealistic, film grain' },
]

export const STEPS = [
  { id: 0, name: '脚本', icon: 'FileText' },
  { id: 1, name: '分镜', icon: 'Layout' },
  { id: 2, name: '图片', icon: 'Image' },
  { id: 3, name: '视频', icon: 'Video' },
]
