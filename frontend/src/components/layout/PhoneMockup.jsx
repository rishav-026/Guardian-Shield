import { Outlet, useNavigate } from 'react-router-dom'

const PhoneMockup = () => {
  const navigate = useNavigate()

  return (
    <div className="demo-page-container">
      <button className="back-to-dashboard" onClick={() => navigate('/')}>← Back to Dashboard</button>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <Outlet />
        </div>
        <div className="phone-home-bar" />
      </div>
      <p className="demo-hint">💡 Simulated UPI payment experience</p>
    </div>
  )
}

export default PhoneMockup
