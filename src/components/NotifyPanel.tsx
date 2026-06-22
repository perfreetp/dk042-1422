import { useState } from 'react'
import { useAlertStore } from '@/stores'
import Timeline from './Timeline'
import type { NotifyChannel, NotifyTarget, NotifyStatus } from '@/types'
import { Send, Phone, Bell, CheckCircle, MessageSquare, Smartphone, Monitor, UserCheck, Users, AlertTriangle, Check, X, Loader2 } from 'lucide-react'

const channels: { key: NotifyChannel; label: string; icon: typeof MessageSquare }[] = [
  { key: 'sms', label: '短信', icon: MessageSquare },
  { key: 'system', label: '系统通知', icon: Monitor },
  { key: 'app', label: 'APP推送', icon: Smartphone },
]

const targets: { key: NotifyTarget; label: string; desc: string; icon: typeof UserCheck }[] = [
  { key: 'driver', label: '通知司机', desc: '司机本人', icon: UserCheck },
  { key: 'supervisor', label: '通知安全主管', desc: '学校安全负责人', icon: Users },
  { key: 'both', label: '全部通知', desc: '司机+安全主管', icon: Bell },
]

interface SendResult {
  notifyTarget: NotifyTarget
  status: NotifyStatus
  failReason?: string
}

export default function NotifyPanel() {
  const { selectedAlertId, alerts, handleLogs, sendNotification, addCallLog, addNoteLog, completeAlert, hasNotified } = useAlertStore()
  const [callContent, setCallContent] = useState('')
  const [callDuration, setCallDuration] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [channel, setChannel] = useState<NotifyChannel>('sms')
  const [notifyTarget, setNotifyTarget] = useState<NotifyTarget>('both')
  const [lastResults, setLastResults] = useState<SendResult[]>([])
  const [isSending, setIsSending] = useState(false)

  const alert = alerts.find((a) => a.id === selectedAlertId)
  if (!alert) return null

  const logs = handleLogs.filter((l) => l.alertId === alert.id)

  const handleSendNotify = async () => {
    setIsSending(true)
    setLastResults([])
    await new Promise((r) => setTimeout(r, 450))
    const results = sendNotification(alert.id, channel, notifyTarget)
    setLastResults(results)
    setIsSending(false)
  }

  const handleAddCall = () => {
    if (!callContent.trim()) return
    addCallLog(alert.id, callContent.trim(), callDuration.trim() || undefined)
    setCallContent('')
    setCallDuration('')
  }

  const handleAddNote = () => {
    if (!noteContent.trim()) return
    addNoteLog(alert.id, noteContent.trim())
    setNoteContent('')
  }

  const handleComplete = () => completeAlert(alert.id)

  const successCount = lastResults.filter((r) => r.status === 'success').length
  const failCount = lastResults.filter((r) => r.status === 'failed').length
  const dupCount = lastResults.filter((r) => r.status === 'duplicate').length

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
        <div className="space-y-4 pt-3 border-t border-surface-300/30">
          <div>
            <label className="text-[11px] text-slate-400 font-medium mb-2 block">发送通知</label>

            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {channels.map((c) => {
                const Icon = c.icon
                const isSelected = channel === c.key
                return (
                  <button
                    key={c.key}
                    onClick={() => setChannel(c.key)}
                    className={`flex items-center justify-center gap-1 h-9 rounded-lg text-xs font-medium transition-all
                      ${isSelected
                        ? 'bg-brand-600/20 text-brand-400 border border-brand-500/40'
                        : 'bg-surface-100 text-slate-400 border border-surface-300/50 hover:border-surface-400 hover:text-slate-300'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {c.label}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {targets.map((t) => {
                const Icon = t.icon
                const isSelected = notifyTarget === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setNotifyTarget(t.key)}
                    className={`flex flex-col items-center justify-center gap-0.5 h-[54px] px-1.5 rounded-lg text-[11px] font-medium transition-all
                      ${isSelected
                        ? 'bg-brand-600/20 text-brand-400 border border-brand-500/40'
                        : 'bg-surface-100 text-slate-400 border border-surface-300/50 hover:border-surface-400 hover:text-slate-300'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                    <span className="text-[9px] opacity-60 font-normal">{t.desc}</span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleSendNotify}
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white text-sm font-medium shadow-lg shadow-brand-600/20 transition-all"
            >
              {isSending ? (
                <><Loader2 className="w-4 h-4 animate-spin" />发送中...</>
              ) : (
                <><Send className="w-4 h-4" />发送通知</>
              )}
            </button>

            {lastResults.length > 0 && (
              <div className="mt-2.5 space-y-1.5">
                {lastResults.map((r, i) => {
                  const label = r.notifyTarget === 'driver' ? '司机' : r.notifyTarget === 'supervisor' ? '安全主管' : null
                  if (!label) return null
                  const ok = r.status === 'success'
                  const dup = r.status === 'duplicate'
                  return (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border
                      ${ok ? 'bg-fence-normal/5 border-fence-normal/30 text-slate-300' :
                        dup ? 'bg-surface-100 border-surface-300/50 text-slate-400' :
                        'bg-fence-breach/5 border-fence-breach/30 text-fence-breach'
                      }`}>
                      {ok ? <Check className="w-3.5 h-3.5 text-fence-normal shrink-0" /> :
                        dup ? <AlertTriangle className="w-3.5 h-3.5 text-slate-500 shrink-0" /> :
                        <X className="w-3.5 h-3.5 text-fence-breach shrink-0" />}
                      <span className="shrink-0">{label}：</span>
                      <span className="truncate">
                        {ok ? '发送成功' : dup ? '已发送过（重复发送）' : `发送失败 — ${r.failReason}`}
                      </span>
                    </div>
                  )
                })}
                {successCount > 0 && (
                  <p className="text-[10px] text-slate-500 text-center">
                    已同步记录到处置时间线
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium mb-1.5 block flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              记录电话沟通
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={callContent}
                onChange={(e) => setCallContent(e.target.value)}
                placeholder="与司机沟通内容..."
                className="w-full h-9 px-3 rounded-lg bg-surface-100 border border-surface-300/50 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
              />
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={callDuration}
                  onChange={(e) => setCallDuration(e.target.value)}
                  placeholder="通话时长（可选，如 1分30秒）"
                  className="flex-1 h-8 px-3 rounded-lg bg-surface-100 border border-surface-300/50 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                />
                <button
                  onClick={handleAddCall}
                  disabled={!callContent.trim()}
                  className="h-8 px-3 rounded-lg bg-fence-near/15 text-fence-near hover:bg-fence-near/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <Phone className="w-3 h-3" />
                  记录
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium mb-1.5 block flex items-center gap-1.5">
              <Send className="w-3 h-3" />
              添加备注
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="补充说明、处理进展等..."
                className="flex-1 h-9 px-3 rounded-lg bg-surface-100 border border-surface-300/50 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className="h-9 px-3 rounded-lg bg-fence-normal/15 text-fence-normal hover:bg-fence-normal/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <Send className="w-3 h-3" />
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
