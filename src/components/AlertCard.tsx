import type { Alert } from '@/types'
import { useAlertStore } from '@/stores'
import { Clock, MapPin, AlertTriangle, ChevronRight, Radio, History } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: '待处理', color: 'text-fence-breach', bg: 'bg-fence-breach/10' },
  processing: { label: '处理中', color: 'text-fence-near', bg: 'bg-fence-near/10' },
  completed: { label: '已完成', color: 'text-fence-normal', bg: 'bg-fence-normal/10' },
}

export default function AlertCard({ alert, onTimelineClick }: { alert: Alert; onTimelineClick?: () => void }) {
  const { setSelectedAlert, setReasonModalOpen, getAlertDurationText } = useAlertStore()
  const config = statusLabels[alert.status]
  const realDuration = getAlertDurationText(alert)
  const isLive = alert.status !== 'completed'

  const handleClick = () => {
    setSelectedAlert(alert.id)
    if (alert.status === 'pending') {
      setReasonModalOpen(true)
    }
  }

  const handleTimelineClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onTimelineClick?.()
  }

  return (
    <div
      className={`group w-full rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 cursor-pointer
        ${alert.status === 'pending'
          ? 'border-fence-breach/40 bg-fence-breach/5 animate-pulse-border'
          : alert.status === 'processing'
          ? 'border-fence-near/30 bg-fence-near/5'
          : 'border-surface-300/40 bg-surface-50'
        }`}
    >
      <div className="flex items-center p-4" onClick={handleClick}>
        <div className={`w-1 h-12 rounded-full shrink-0 mr-4 ${
          alert.status === 'pending' ? 'bg-fence-breach' : alert.status === 'processing' ? 'bg-fence-near' : 'bg-fence-normal'
        }`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-white font-mono">{alert.plateNumber}</h3>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {alert.routeName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              越界 {realDuration}
              {isLive && <Radio className="w-2.5 h-2.5 text-fence-breach animate-pulse" />}
            </span>
          </div>
          {alert.reason && (
            <div className="mt-2 text-xs text-slate-400">
              原因: <span className="text-slate-300">{alert.reason}</span>
              {alert.note && <span className="text-slate-500 ml-1">— {alert.note}</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {onTimelineClick && (
            <button
              onClick={handleTimelineClick}
              className="w-7 h-7 rounded-lg bg-surface-200/50 hover:bg-surface-300/70 flex items-center justify-center transition-colors"
              title="查看处置时间线"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
          {alert.status === 'pending' && (
            <div className="flex items-center gap-1 text-xs text-fence-breach font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              需处置
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>
    </div>
  )
}
