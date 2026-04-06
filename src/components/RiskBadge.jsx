export default function RiskBadge({ riskFlag }) {
  if (riskFlag) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-danger rounded-lg px-4 py-3 text-sm font-semibold animate-fade-in">
        <span className="text-base">⚠️</span>
        <span>At Risk — Low engagement detected. Please contact your teacher.</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-success rounded-lg px-4 py-3 text-sm font-semibold animate-fade-in">
      <span className="text-base">✅</span>
      <span>On Track — Good engagement level! Keep it up.</span>
    </div>
  )
}
