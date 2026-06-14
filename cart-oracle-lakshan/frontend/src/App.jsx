import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CartPage from "./pages/CartPage"
import AdminPage from "./pages/AdminPage"
import TopNav from "./components/layout/TopNav"
import VoiceAssistant from "./components/VoiceAssistant"
import CartBar from "./components/CartBar"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5]">
        <TopNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <VoiceAssistant />
        <CartBar />
      </div>
    </Router>
  )
}
