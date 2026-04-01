import { create } from 'zustand'

const API_URL = '/api'

const useStore = create((set, get) => ({
  // 用户状态
  user: null,
  isLoggedIn: false,
  points: 0,
  membership: 'free',
  
  // 当前项目
  currentProject: null,
  
  // 项目列表
  projects: [],
  
  // 工作流步骤
  currentStep: 0,
  
  // Actions
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  logout: () => set({ user: null, isLoggedIn: false, currentProject: null, points: 0, membership: 'free' }),
  
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects] 
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentStep: (step) => set({ currentStep: step }),
  
  // 刷新积分
  refreshPoints: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/points`, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      const data = await res.json()
      if (data.points !== undefined) {
        set({ points: data.points, membership: data.membership })
      }
    } catch (e) {
      console.error('刷新积分失败', e)
    }
  },
  
  // 扣除积分
  deductPoints: async (amount, description, projectId) => {
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
      const res = await fetch(`${API_URL}/points/deduct`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ amount, description, projectId })
      })
      const data = await res.json()
      if (data.success) {
        set({ points: data.points })
        return true
      }
      return false
    } catch (e) {
      console.error('扣除积分失败', e)
      return false
    }
  },
  
  // 重置工作流
  resetWorkflow: () => set({ 
    currentProject: null, 
    currentStep: 0 
  }),
}))

export default useStore
