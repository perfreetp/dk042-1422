import { useAlertStore } from '@/stores'
import NotifyPanel from './NotifyPanel'
import { X, AlertTriangle, Clock, MapPin, User, Radio, CheckCircle, ShieldAlert } from 'lucide-react'

const statusConfig = {
  pending: { label: '待处理', color: 'text-fence-breach', bg: 'bg-fence-breach/15', dot: 'bg-fence-breach' },
  processing: { label: '处理中', color: 'text-fence-near', bg: 'bg-fence-near/15', dot: 'bg-fence-near' },
  completed: { label: '已完成', color: 'text-fence-normal', bg: 'bg-fence-normal/15', dot: 'bg-fence-normal' },
}

export default function AlertTimelineDrawer() {
  const { timelineDrawerOpen, setTimelineDrawerOpen, timelineAlertId, alerts, getAlertDurationText, getAlertDurationMinutes, durationTick } = useAlertStore()

  void durationTick

  if (!timelineDrawerOpen || !timelineAlertId) return null

  const alert = alerts.find((a) => a.id === timelineAlertId)
  if (!alert) return null

  const config = statusConfig[alert.status]
  const realDuration = getAlertDurationText(alert)
  const realDurationMinutes = getAlertDurationMinutes(alert)
  const isLive = alert.status !== 'completed'

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/60" onClick={() => setTimelineDrawerOpen(false)} />
      <div className="relative w-[480px] h-full bg-surface-50 border-l border-surface-300/50 animate-slide-in-right overflow-y-auto shadow-2xl shadow-black/40">
        <div className="sticky top-0 z-10 bg-surface-50/95 backdrop-blur-sm border-b border-surface-300/40 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">处置时间线详情</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">查看完整处置记录，可补备注或继续通知</p>
          </div>
          <button
            onClick={() => setTimelineDrawerOpen(false)}
            className="w-7 h-7 rounded-lg bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-xl border border-surface-300/40 bg-surface-100/50 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono">{alert.plateNumber}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{alert.schoolName} · {alert.routeName}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.bg} ${config.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${isLive ? 'animate-pulse' : ''}`} />
                {config.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div className="px-3 py-2.5 rounded-lg bg-surface-50 border border-surface-300/30">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <Clock className="w-3 h-3" />
                  越界时长
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-bold font-mono ${isLive ? 'text-fence-breach' : 'text-slate-300'}`}>
                    {realDuration}
                  </span>
                  {isLive && <Radio className="w-3 h-3 text-fence-breach animate-pulse" />}
                </div>
              </div>
              <div className="px-3 py-2.5 rounded-lg bg-surface-50 border border-surface-300/30">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <MapPin className="w-3 h-3" />
                  越界时间
                </div>
                <span className="text-xs font-mono text-slate-300 block">
                  {alert.fenceOutTime.split(' ')[1]}
                </span>
              </div>
              <div className="px-3 py-2.5 rounded-lg bg-surface-50 border border-surface-300/30">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <User className="w-3 h-3" />
                  处置人
                </div>
                <span className="text-xs text-slate-300">{alert.handlerName || '未指派'}</span>
              </div>
              <div className="px-3 py-2.5 rounded-lg bg-surface-50 border border-surface-300/30">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  越界原因
                </div>
                <span className="text-xs text-slate-300">{alert.reason || '待确认'}</span>
              </div>
            </div>

            {alert.reason && (
              <div className="px-3 py-2.5 rounded-lg bg-brand-600/10 border border-brand-500/20">
                <p className="text-xs text-slate-300">
                  <span className="text-brand-400 font-semibold">原因：</span>
                  {alert.reason}
                  {alert.note && <span className="text-slate-400 ml-1">— {alert.note}</span>}
                </p>
              </div>
            )}

            {alert.status === 'completed' && alert.completeTime && (
              <div className="mt-2.5 px-3 py-2.5 rounded-lg bg-fence-normal/10 border border-fence-normal/20 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-fence-normal shrink-0" />
                <div>
                  <p className="text-xs text-fence-normal font-semibold">已闭环</p>
                  <p className="text-[10px] text-slate-400 font-mono">{alert.completeTime}</p>
                </div>
              </div>
            )}

            {isLive && (
              <div className="mt-2.5 px-3 py-2.5 rounded-lg bg-fence-breach/5 border border-fence-breach/20 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-fence-breach shrink-0 animate-pulse" />
                <div>
                  <p className="text-xs text-fence-breach font-semibold">处置进行中</p>
                  <p className="text-[10px] text-slate-400">已越界 {realDurationMinutes} 分钟，请持续跟进</p>
                </div>
              </div>
            )}
          </div>

          <NotifyPanel alertId={alert.id} showFullControls={alert.status === 'processing'} />
        </div>
      </div>
    </div>
  )
}
