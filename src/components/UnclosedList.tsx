import type { Alert } from '@/types'
import { useAlertStore } from '@/stores'
import { AlertTriangle, Clock, User, ChevronRight, Radio } from 'lucide-react'

export default function UnclosedList() {
  const { alerts, setTimelineDrawerOpen, getAlertDurationText, durationTick } = useAlertStore()

  void durationTick

  const unclosed = alerts
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => {
      const da = new Date(a.fenceOutTime).getTime()
      const db = new Date(b.fenceOutTime).getTime()
      return db - da
    })

  if (unclosed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <div className="w-12 h-12 rounded-full bg-fence-normal/15 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6 text-fence-normal" />
        </div>
        <p className="text-sm font-medium text-fence-normal">所有预警已闭环</p>
        <p className="text-xs text-slate-500 mt-1">今日无未闭环事项</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {unclosed.map((alert) => (
        <UnclosedItem key={alert.id} alert={alert} onClick={() => setTimelineDrawerOpen(true, alert.id)} />
      ))}
    </div>
  )
}

function UnclosedItem({ alert, onClick }: { alert: Alert; onClick: () => void }) {
  const { getAlertDurationText } = useAlertStore()
  const realDuration = getAlertDurationText(alert)
  const isLive = alert.status !== 'completed'

  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex items-center gap-4 p-4 rounded-xl border border-fence-breach/30 bg-fence-breach/5 hover:bg-fence-breach/10 hover:border-fence-breach/50 transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-fence-breach/15 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-5 h-5 text-fence-breach" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-white font-mono">{alert.plateNumber}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            alert.status === 'pending' ? 'bg-fence-breach/15 text-fence-breach' : 'bg-fence-near/15 text-fence-near'
          }`}>
            {alert.status === 'pending' ? '待处理' : '处理中'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {realDuration}
            {isLive && <Radio className="w-2.5 h-2.5 text-fence-breach animate-pulse" />}
          </span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{alert.handlerName || '未指派'}</span>
          <span>{alert.schoolName} · {alert.routeName}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
    </button>
  )
}
