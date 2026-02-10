const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center gap-3 text-white/80">
    <span className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
    <span className="w-3 h-3 rounded-full bg-warning animate-ping" style={{ animationDelay: '120ms' }} />
    <span className="w-3 h-3 rounded-full bg-success animate-ping" style={{ animationDelay: '240ms' }} />
    <p className="text-sm">{label}</p>
  </div>
)

export default LoadingSpinner
