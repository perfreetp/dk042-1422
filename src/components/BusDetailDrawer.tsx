import { useBusStore } from '@/stores'
import { routes, schools } from '@/data/mockData'
import FenceMap from './FenceMap'
import { X, MapPin, Clock, User, Phone, Car } from 'lucide-react'

export default function BusDetailDrawer() {
  const { selectedBusId, setDrawerOpen, buses } = useBusStore()
  const bus = buses.find((b) => b.id === selectedBusId)

  if (!bus) return null

  const route = routes.find((r) => r.id === bus.routeId)
  const school = schools.find((s) => s.id === bus.schoolId)
  const statusLabel = bus.status === 'normal' ? '正常' : bus.status === 'near_fence' ? '接近围栏' : '已越界'
  const statusColor = bus.status === 'normal' ? 'text-fence-normal' : bus.status === 'near_fence' ? 'text-fence-near' : 'text-fence-breach'

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawerOpen(false)}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-[480px] h-full bg-surface-50 border-l border-surface-300/50 shadow-2xl shadow-black/40 animate-slide-in-right overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-surface-50/90 backdrop-blur-sm border-b border-surface-300/50">
          <div>
            <h2 className="text-lg font-bold text-white font-mono">{bus.plateNumber}</h2>
            <p className="text-xs text-slate-400">{school?.name} · {route?.name}</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300">围栏地图</h3>
              <span className={`text-xs font-semibold ${statusColor}`}>● {statusLabel}</span>
            </div>
            {route && (
              <FenceMap
                fencePoints={route.fencePoints}
                busX={bus.mapX}
                busY={bus.mapY}
                busStatus={bus.status}
              />
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">车辆信息</h3>
            <div className="space-y-2.5">
              <InfoRow icon={Car} label="司机" value={bus.driverName} />
              <InfoRow icon={Phone} label="电话" value={bus.driverPhone} mono />
              <InfoRow icon={User} label="随车照管员" value={bus.attendantName} />
              <InfoRow icon={MapPin} label="当前坐标" value={`${bus.latitude.toFixed(4)}, ${bus.longitude.toFixed(4)}`} mono />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">围栏进出记录</h3>
            <div className="bg-surface-100 rounded-lg border border-surface-300/50 divide-y divide-surface-300/30">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-fence-normal" />
                  <span className="text-xs text-slate-400">最近进入围栏</span>
                </div>
                <span className="text-xs font-mono text-slate-300">{bus.lastFenceInTime}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${bus.lastFenceOutTime === '-' ? 'bg-slate-600' : 'bg-fence-breach'}`} />
                  <span className="text-xs text-slate-400">最近离开围栏</span>
                </div>
                <span className="text-xs font-mono text-slate-300">{bus.lastFenceOutTime}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-400">数据更新</span>
                </div>
                <span className="text-xs font-mono text-slate-300">{bus.lastUpdateTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, mono }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-100/50">
      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
      <span className="text-xs text-slate-500 w-20 shrink-0">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono' : ''} text-slate-200`}>{value}</span>
    </div>
  )
}
