import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  sub?: string
  color: string
  delay?: number
}

export default function StatCard({ icon, label, value, sub, color, delay = 0 }: StatCardProps) {
  return (
    <div
      className="px-5 py-4 rounded-xl bg-surface-50 border border-surface-300/40 animate-count-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-white">{value}</span>
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
      </div>
    </div>
  )
}
