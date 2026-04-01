import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Workflow from './pages/Workflow'
import WorkflowNew from './pages/WorkflowNew'
import WorkflowDetail from './pages/WorkflowDetail'
import Works from './pages/Works'
import History from './pages/History'
import useStore from './store/useStore'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useStore()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { setUser, setProjects } = useStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setUser(user)
        fetch('/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.projects) {
              setProjects(data.projects)
            }
          })
          .catch(console.error)
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [setUser, setProjects])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/works" element={<Works />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/workflow" element={
          <PrivateRoute><Workflow /></PrivateRoute>
        } />
        <Route path="/workflow/new" element={
          <PrivateRoute><WorkflowNew /></PrivateRoute>
        } />
        <Route path="/workflow/:id" element={
          <PrivateRoute><WorkflowDetail /></PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute><History /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
