import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RecordsPage from './pages/RecordsPage'
import SettingsPage from './pages/SettingsPage'
import SharedViewerPage from './pages/SharedViewerPage'
import SharePage from './pages/SharePage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/shared/:token" element={<SharedViewerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App