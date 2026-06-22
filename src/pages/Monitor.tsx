import FilterBar from '@/components/FilterBar'
import BusCard from '@/components/BusCard'
import BusDetailDrawer from '@/components/BusDetailDrawer'
import RiskSummaryView from '@/components/RiskSummaryView'
import { useBusStore } from '@/stores'
import { Activity } from 'lucide-react'

export default function Monitor() {
  const { getFilteredBuses, drawerOpen, filter } = useBusStore()
  const filteredBuses = getFilteredBuses()

  const normalCount = filteredBuses.filter((b) => b.status === 'normal').length
  const nearCount = filteredBuses.filter((b) => b.status === 'near_fence').length
  const breachedCount = filteredBuses.filter((b) => b.status === 'breached').length

  const hasActiveFilter = filter.schoolId !== '' || filter.routeId !== '' || filter.plateNumber !== '' || filter.status !== 'all'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="shrink-0 px-8 pt-6 pb-4 border-b border-surface-300/30">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-white">运行监控</h1>
            <p className="text-xs text-slate-500 mt-1">实时查看校车运行状态与围栏信息</p>
          </div>
          <div className="flex items-center gap-5">
            <MiniStat label="正常" count={normalCount} color="text-fence-normal" />
            <MiniStat label="接近围栏" count={nearCount} color="text-fence-near" />
            <MiniStat label="已越界" count={breachedCount} color="text-fence-breach" />
          </div>
        </div>
        <FilterBar />
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        <RiskSummaryView />

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300">
            车辆列表
            {hasActiveFilter && (
              <span className="ml-2 px-2 py-0.5 rounded-md bg-brand-600/15 text-brand-400 text-[10px] font-medium">
                已筛选 · {filteredBuses.length}辆
              </span>
            )}
          </h2>
        </div>

        {filteredBuses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Activity className="w-12 h-12 mb-3 text-slate-600" />
            <p className="text-sm">暂无符合条件的车辆</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filteredBuses.map((bus, i) => (
              <div key={bus.id} className="animate-slide-in-left" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}>
                <BusCard bus={bus} />
              </div>
            ))}
          </div>
        )}
      </div>

      {drawerOpen && <BusDetailDrawer />}
    </div>
  )
}

function MiniStat({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-lg font-bold font-mono ${color} animate-count-up`}>{count}</span>
    </div>
  )
}
