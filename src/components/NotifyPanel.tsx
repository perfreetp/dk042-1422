import { useState } from 'react'
import { useAlertStore } from '@/stores'
import Timeline from './Timeline'
import { Send, Phone, Bell, CheckCircle } from 'lucide-react'

export default function NotifyPanel() {
  const { selectedAlertId, alerts, handleLogs, addNotificationLog, addCallLog, addNoteLog, completeAlert } = useAlertStore()
  const [callContent, setCallContent] = useState('')
  const [noteContent, setNoteContent] = useState('')

  const alert = alerts.find((a) => a.id === selectedAlertId)
  if (!alert) return null

  const logs = handleLogs.filter((l) => l.alertId === alert.id)

  const handleNotify = () => {
    addNotificationLog(alert.id)
  }

  const handleAddCall = () => {
    if (!callContent.trim()) return
    addCallLog(alert.id, callContent.trim())
    setCallContent('')
  }

  const handleAddNote = () => {
    if (!noteContent.trim()) return
    addNoteLog(alert.id, noteContent.trim())
    setNoteContent('')
  }

  const handleComplete = () => {
    completeAlert(alert.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">处置记录</h3>
        {alert.status === 'processing' && (
          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fence-normal/15 text-fence-normal text-xs font-medium hover:bg-fence-normal/25 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            标记闭环
          </button>
        )}
      </div>

      <Timeline logs={logs} />

      {alert.status === 'processing' && (
        <div className="space-y-3 pt-3 border-t border-surface-300/30">
          <button
            onClick={handleNotify}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-brand-600/15 text-brand-400 text-sm font-medium hover:bg-brand-600/25 transition-colors"
          >
            <Bell className="w-4 h-4" />
            一键通知司机和安全主管
          </button>

          <div>
            <label className="text-[11px] text-slate-500 mb-1.5 block">记录电话沟通</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={callContent}
                onChange={(e) => setCallContent(e.target.value)}
                placeholder="输入沟通内容..."
                className="flex-1 h-9 px-3 rounded-lg bg-surface-100 border border-surface-300/50 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCall()}
              />
              <button
                onClick={handleAddCall}
                className="h-9 px-3 rounded-lg bg-fence-near/15 text-fence-near hover:bg-fence-near/25 transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">记录</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 mb-1.5 block">添加备注</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="输入备注内容..."
                className="flex-1 h-9 px-3 rounded-lg bg-surface-100 border border-surface-300/50 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                className="h-9 px-3 rounded-lg bg-fence-normal/15 text-fence-normal hover:bg-fence-normal/25 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">添加</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
