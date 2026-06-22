import type { HandleLog } from '@/types'
import { Bell, Phone, FileText } from 'lucide-react'

const typeConfig = {
  notification: { icon: Bell, label: '通知', color: 'text-brand-400', bg: 'bg-brand-500/15', line: 'bg-brand-500/30' },
  call: { label: '通话', color: 'text-fence-near', bg: 'bg-fence-near/15', line: 'bg-fence-near/30', icon: Phone },
  note: { label: '备注', color: 'text-fence-normal', bg: 'bg-fence-normal/15', line: 'bg-fence-normal/30', icon: FileText },
}

export default function Timeline({ logs }: { logs: HandleLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        暂无处置记录
      </div>
    )
  }

  return (
    <div className="relative">
      {logs.map((log, i) => {
        const config = typeConfig[log.type]
        const Icon = config.icon
        return (
          <div key={log.id} className="relative flex gap-4 pb-6 last:pb-0">
            {i < logs.length - 1 && (
              <div className="absolute left-[15px] top-[34px] w-px h-[calc(100%-34px)] bg-surface-300/50" />
            )}
            <div className={`w-[30px] h-[30px] rounded-full ${config.bg} flex items-center justify-center shrink-0 z-10`}>
              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-semibold ${config.color}`}>{config.label}</span>
                <span className="text-[10px] text-slate-500 font-mono">{log.operateTime}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{log.content}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-slate-500">操作人: {log.operatorName}</span>
                {log.target && <span className="text-[10px] text-slate-500">对象: {log.target}</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
