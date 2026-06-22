import { useState } from 'react'
import type { AlertReason } from '@/types'
import { useAlertStore } from '@/stores'
import { X, AlertTriangle } from 'lucide-react'

const reasons: AlertReason[] = ['临时绕行', '道路施工', '司机误驶', '异常停靠']

const reasonIcons: Record<AlertReason, string> = {
  '临时绕行': '🔄',
  '道路施工': '🚧',
  '司机误驶': '🗺️',
  '异常停靠': '🛑',
}

export default function ReasonModal() {
  const { selectedAlertId, alerts, confirmReason, setReasonModalOpen } = useAlertStore()
  const [selectedReason, setSelectedReason] = useState<AlertReason | null>(null)
  const [note, setNote] = useState('')

  const alert = alerts.find((a) => a.id === selectedAlertId)
  if (!alert || alert.status !== 'pending') return null

  const handleConfirm = () => {
    if (!selectedReason) return
    confirmReason(alert.id, selectedReason, note)
    setNote('')
    setSelectedReason(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setReasonModalOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-[440px] bg-surface-50 border border-surface-300/60 rounded-2xl shadow-2xl shadow-black/40 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-300/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-fence-breach/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-fence-breach" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">越界原因确认</h3>
              <p className="text-[11px] text-slate-500">{alert.plateNumber} · {alert.routeName}</p>
            </div>
          </div>
          <button
            onClick={() => setReasonModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-400 mb-4">请选择越界原因：</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200
                  ${selectedReason === reason
                    ? 'border-brand-500 bg-brand-600/15 text-brand-400 shadow-sm shadow-brand-500/20'
                    : 'border-surface-300/50 bg-surface-100 text-slate-300 hover:border-surface-400 hover:bg-surface-200'
                  }`}
              >
                <span className="text-lg">{reasonIcons[reason]}</span>
                {reason}
              </button>
            ))}
          </div>

          <div className="mb-5">
            <label className="text-xs text-slate-400 mb-2 block">补充说明（可选）</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="请输入补充说明..."
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-300/50 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 resize-none transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setReasonModalOpen(false)}
              className="flex-1 h-10 rounded-lg bg-surface-200 hover:bg-surface-300 text-sm text-slate-300 font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedReason}
              className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedReason
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-surface-300 text-slate-500 cursor-not-allowed'
                }`}
            >
              确认并通知
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
