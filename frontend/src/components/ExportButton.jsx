import { FiDownloadCloud } from 'react-icons/fi'

const ExportButton = ({ onExport }) => (
  <button onClick={onExport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-600 transition">
    <FiDownloadCloud /> Export
  </button>
)

export default ExportButton
