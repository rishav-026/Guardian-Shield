import { Routes, Route, Outlet } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import TransactionHistory from './pages/TransactionHistory'
import MerchantIntelligence from './pages/MerchantIntelligence'
import Settings from './pages/Settings'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import PhoneMockup from './components/layout/PhoneMockup'
import DemoHome from './pages/demo/DemoHome'
import DemoPaymentEntry from './pages/demo/DemoPaymentEntry'
import DemoProcessing from './pages/demo/DemoProcessing'
import DemoSafe from './pages/demo/DemoSafe'
import DemoBlocked from './pages/demo/DemoBlocked'
import DemoVerify from './pages/demo/DemoVerify'
import DemoSuccess from './pages/demo/DemoSuccess'

const Shell = () => (
  <div className="min-h-screen bg-[#0d1117] text-white">
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-4">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <Header />
        <Outlet />
      </div>
    </div>
  </div>
)

const App = () => (
  <Routes>
    <Route element={<Shell />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/transactions" element={<TransactionHistory />} />
      <Route path="/merchants" element={<MerchantIntelligence />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
    <Route path="/demo" element={<PhoneMockup />}>
      <Route index element={<DemoHome />} />
      <Route path="pay" element={<DemoPaymentEntry />} />
      <Route path="processing" element={<DemoProcessing />} />
      <Route path="safe" element={<DemoSafe />} />
      <Route path="blocked" element={<DemoBlocked />} />
      <Route path="verify" element={<DemoVerify />} />
      <Route path="success" element={<DemoSuccess />} />
    </Route>
  </Routes>
)

export default App
