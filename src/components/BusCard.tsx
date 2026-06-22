import type { Bus } from '@/types'
import { useBusStore } from '@/stores'
import { MapPin, Clock, Users } from 'lucide-react'

const statusConfig = {
  normal: { label: '正常', color: 'bg-fence-normal', border: 'border-l-fence-normal', bg: 'bg-fence-normal/5', text: 'text-fence-normal' },
  near_fence: { label: '接近围栏', color: 'bg-fence-near', border: 'border-l-fence-near', bg: 'bg-fence-near/5', text: 'text-fence-near' },
  breached: { label: '已越界', color: 'bg-fence-breach', border: 'border-l-fence-breach', bg: 'bg-fence-breach/5', text: 'text-fence-breach' },
}

export default function BusCard({ bus }: { bus: Bus }) {
  const { setSelectedBus } = useBusStore()
  const config = statusConfig[bus.status]
  const route = useBusStore.getState().buses.length ? null : null

  return (
    <button
      onClick={() => setSelectedBus(bus.id)}
      className={`group relative w-full text-left rounded-xl border border-surface-300/40 ${config.border} border-l-[4px] ${bus.status === 'breached' ? 'animate-pulse-border' : ''} bg-surface-50 hover:bg-surface-200/80 p-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white font-mono tracking-wide">{bus.plateNumber}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {useBusStore.getState().buses.find(b => b.id === bus.id) ? '' : ''}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.bg} ${config.text}`}>
          <span className={`status-dot ${bus.status === 'normal' ? 'status-dot-normal' : bus.status === 'near_fence' ? 'status-dot-near' : 'status-dot-breach'}`} />
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{bus.routeId === 'r1' ? '阳光小学-东线' : bus.routeId === 'r2' ? '阳光小学-西线' : bus.routeId === 'r3' ? '育才中学-1号线' : bus.routeId === 'r4' ? '育才中学-2号线' : bus.routeId === 'r5' ? '育才中学-3号线' : bus.routeId === 'r6' ? '星星幼儿园-A线' : bus.routeId === 'r7' ? '星星幼儿园-B线' : '星星幼儿园-C线'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>照管员: {bus.attendantName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          <span className="font-mono text-[11px]">{bus.lastUpdateTime}</span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ring-1 ring-white/5" />
    </button>
  )
}
