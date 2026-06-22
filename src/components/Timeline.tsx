import type { HandleLog } from '@/types'
import { Bell, Phone, FileText, Check, X, AlertCircle, Clock, RotateCcw, Loader2, User } from 'lucide-react'

const typeConfig = {
  notification: { icon: Bell, label: '通知', color: 'text-brand-400', bg: 'bg-brand-500/15', line: 'bg-brand-500/30' },
  call: { label: '通话', color: 'text-fence-near', bg: 'bg-fence-near/15', line: 'bg-fence-near/30', icon: Phone },
  note: { label: '备注', color: 'text-fence-normal', bg: 'bg-fence-normal/15', line: 'bg-fence-normal/30', icon: FileText },
}

const statusConfig: Record<string, { icon: typeof Check; label: string; color: string }> = {
  success: { icon: Check, label: '成功', color: 'text-fence-normal' },
  failed: { icon: X, label: '失败', color: 'text-fence-breach' },
  duplicate: { icon: AlertCircle, label: '重复', color: 'text-slate-400' },
}

const channelLabel: Record<string, string> = {
  sms: '短信',
  system: '系统',
  app: 'APP',
}

const callTargetLabel: Record<string, string> = {
  driver: '司机',
  attendant: '照管员',
  supervisor: '安全主管',
}

export default function Timeline({
  logs,
  onResend,
  resendingId,
}: {
  logs: HandleLog[]
  onResend?: (logId: string) => void
  resendingId?: string | null
}) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        暂无处置记录
      </div>
    )
  }

  const sorted = [...logs].sort((a, b) => a.operateTime.localeCompare(b.operateTime))

  return (
    <div className="relative">
      {sorted.map((log, i) => {
        const config = typeConfig[log.type]
        const Icon = config.icon
        const isFailedNotif = log.type === 'notification' && log.notifyStatus === 'failed' && !log.originalLogId
        const isResending = resendingId === log.id
        const isResent = !!log.originalLogId
        return (
          <div key={log.id} className="relative flex gap-4 pb-6 last:pb-0">
            {i < sorted.length - 1 && (
              <div className="absolute left-[15px] top-[34px] w-px h-[calc(100%-34px)] bg-surface-300/50" />
            )}
            <div className={`w-[30px] h-[30px] rounded-full ${config.bg} flex items-center justify-center shrink-0 z-10`}>
              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[11px] font-semibold ${config.color}`}>
                  {config.label}
                  {isResent && <span className="ml-1 opacity-60">（重发）</span>}
                </span>
                {log.type === 'notification' && log.channel && (
                  <span className="px-1.5 py-0.5 rounded bg-surface-300/50 text-[9px] text-slate-400 font-mono">
                    {channelLabel[log.channel] || log.channel}
                  </span>
                )}
                {log.type === 'call' && log.callTarget && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-300/50 text-[9px] text-slate-400">
                    <User className="w-2 h-2" />
                    {callTargetLabel[log.callTarget] || log.callTarget}
                  </span>
                )}
                {log.type === 'notification' && log.notifyStatus && (() => {
                  const s = statusConfig[log.notifyStatus]
                  const SIcon = s.icon
                  return (
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${s.color}`}>
                      <SIcon className="w-2.5 h-2.5" />
                      {s.label}
                    </span>
                  )
                })()}
                {log.callDuration && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500">
                    <Clock className="w-2.5 h-2.5" />
                    {log.callDuration}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 font-mono ml-auto">{log.operateTime}</span>
              </div>
              <p className={`text-xs leading-relaxed ${
                log.type === 'notification' && log.notifyStatus === 'failed'
                  ? 'text-fence-breach'
                  : log.type === 'notification' && log.notifyStatus === 'duplicate'
                  ? 'text-slate-500'
                  : 'text-slate-300'
              }`}>
                {log.content}
              </p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-[10px] text-slate-500">操作人: {log.operatorName}</span>
                {log.target && <span className="text-[10px] text-slate-500">对象: {log.target}</span>}
                {log.failReason && <span className="text-[10px] text-fence-breach">原因: {log.failReason}</span>}
                {isFailedNotif && onResend && (
                  <button
                    onClick={() => onResend(log.id)}
                    disabled={isResending}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-fence-breach/10 text-fence-breach text-[10px] font-medium hover:bg-fence-breach/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResending ? (
                      <><Loader2 className="w-2.5 h-2.5 animate-spin" />重发中</>
                    ) : (
                      <><RotateCcw className="w-2.5 h-2.5" />一键重发</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
