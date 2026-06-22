import { useState, useEffect } from 'react'
import { useAlertStore } from '@/stores'
import AlertCard from '@/components/AlertCard'
import ReasonModal from '@/components/ReasonModal'
import NotifyPanel from '@/components/NotifyPanel'
import { AlertTriangle, ShieldCheck, Clock, Play, SkipForward } from 'lucide-react'

type TabKey = 'all' | 'pending' | 'processing' | 'completed'

export default function Alerts() {
  const { alerts, selectedAlertId, setSelectedAlert, reasonModalOpen, setReasonModalOpen, getNextPendingAlert } = useAlertStore()
  const [tab, setTab] = useState<TabKey>('all')

  useEffect(() => {
    const pending = getNextPendingAlert()
    if (pending && !selectedAlertId && !reasonModalOpen) {
      setReasonModalOpen(true, pending.id)
    }
  }, [])

  const filteredAlerts = tab === 'all' ? alerts : alerts.filter((a) => a.status === tab)
  const selectedAlert = alerts.find((a) => a.id === selectedAlertId)

  const pendingCount = alerts.filter((a) => a.status === 'pending').length
  const processingCount = alerts.filter((a) => a.status === 'processing').length
  const completedCount = alerts.filter((a) => a.status === 'completed').length

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: alerts.length },
    { key: 'pending', label: '待处理', count: pendingCount },
    { key: 'processing', label: '处理中', count: processingCount },
    { key: 'completed', label: '已完成', count: completedCount },
  ]

  const handleStartQueue = () => {
    const pending = getNextPendingAlert()
    if (pending) setReasonModalOpen(true, pending.id)
  }

  const handleNextPending = () => {
    const pending = getNextPendingAlert()
    if (pending) setReasonModalOpen(true, pending.id)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="shrink-0 px-8 pt-6 pb-4 border-b border-surface-300/30">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-white">预警处置</h1>
            <p className="text-xs text-slate-500 mt-1">处理越界预警，确认原因并通知相关人</p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && !reasonModalOpen && (
              <button
                onClick={handleStartQueue}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fence-breach/15 text-fence-breach text-xs font-semibold hover:bg-fence-breach/25 transition-colors border border-fence-breach/30 animate-pulse"
              >
                <Play className="w-3 h-3" />
                开始处理队列（{pendingCount}）
              </button>
            )}
            {pendingCount > 0 && reasonModalOpen && (
              <button
                onClick={handleNextPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-200 text-slate-300 text-xs font-medium hover:bg-surface-300 transition-colors"
              >
                <SkipForward className="w-3 h-3" />
                下一条
              </button>
            )}
            {pendingCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fence-breach/10 text-fence-breach text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {pendingCount} 条待处理
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${tab === t.key
                  ? 'bg-surface-300/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-surface-200/50'
                }`}
            >
              {t.label}
              <span className="ml-1 opacity-60">{t.count}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-3 max-w-2xl">
            {filteredAlerts.map((alert, i) => (
              <div key={alert.id} className="animate-slide-in-left" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}>
                <AlertCard alert={alert} />
              </div>
            ))}
            {filteredAlerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <ShieldCheck className="w-12 h-12 mb-3 text-slate-600" />
                <p className="text-sm">暂无预警记录</p>
              </div>
            )}
          </div>
        </div>

        {selectedAlert && (
          <div className="w-[380px] shrink-0 border-l border-surface-300/30 bg-surface-50/50 overflow-y-auto">
            <div className="p-6">
              <div className="mb-5">
                <h3 className="text-sm font-bold text-white font-mono mb-1">{selectedAlert.plateNumber}</h3>
                <p className="text-xs text-slate-400">{selectedAlert.schoolName} · {selectedAlert.routeName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-300/30">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                    <Clock className="w-3 h-3" />
                    越界时长
                  </div>
                  <span className="text-sm font-bold font-mono text-fence-breach">{selectedAlert.duration}</span>
                </div>
                <div className="px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-300/30">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    越界时间
                  </div>
                  <span className="text-xs font-mono text-slate-300">{selectedAlert.fenceOutTime}</span>
                </div>
              </div>

              <NotifyPanel />
            </div>
          </div>
        )}
      </div>

      {reasonModalOpen && <ReasonModal />}
    </div>
  )
}
